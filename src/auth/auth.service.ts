import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signTokens(userId: string, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const accessTokenSecret = this.config.get('ACCESS_TOKEN_SECRET');
    const refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwt.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: accessTokenSecret,
      }),
      await this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: refreshTokenSecret,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signAccessToken(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const accessTokenSecret = this.config.get('ACCESS_TOKEN_SECRET');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: 60 * 15,
      secret: accessTokenSecret,
    });

    return {
      accessToken,
    };
  }

  async updateRefreshToken(userId: string, refresh_token: string) {
    const hashedToken = await hash(refresh_token);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async signUp(dto: SignUpDto): Promise<Tokens> {
    const hashedPassword = await hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          username: dto.username,
        },
      });

      const tokens = await this.signTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const isMatch = await verify(user.password, dto.password);
    if (!isMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    const refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: refreshTokenSecret,
    });

    if (payload.sub) {
      await this.prisma.user.update({
        where: {
          id: payload.sub,
          refreshToken: {
            not: null,
          },
        },
        data: {
          refreshToken: null,
        },
      });
    }
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: refreshTokenSecret,
    });

    if (!payload.sub) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const isMatch = await verify(user.refreshToken, refreshToken);
    if (!isMatch) {
      throw new ForbiddenException('Access denied');
    }

    return this.signAccessToken(user.id, user.email);
  }
}
