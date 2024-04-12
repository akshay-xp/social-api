import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}
