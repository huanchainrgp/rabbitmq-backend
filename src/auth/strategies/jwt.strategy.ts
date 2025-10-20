import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import {
  TokenRevokedException,
  UserNotFoundException,
} from '../../common/exceptions/api.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    // Extract token from header
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Check if token is blacklisted
    if (token && this.authService.isTokenBlacklisted(token)) {
      throw new TokenRevokedException('Token đã bị thu hồi');
    }

    // Validate user still exists
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UserNotFoundException('Người dùng không tồn tại');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
