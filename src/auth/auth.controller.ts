import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';
import { Cookies } from './decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.signUp(dto);

    // set refresh token in http cookies
    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // set refresh token in http cookies
    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('logout')
  logout(
    @Cookies('jwt') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): void {
    this.authService.logout(refreshToken);

    // clear http cookie
    response.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  refresh(
    @Cookies('jwt') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refresh(refreshToken);
  }
}
