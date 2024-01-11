import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class CustomAdminStrategy extends PassportStrategy(
  Strategy,
  'custom-admin-token',
) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    try {
      const authorization = request.headers['authorization'];
      const token = this.getToken(authorization);
      const token_decoded = token
        ? Buffer.from(token, 'base64').toString()
        : null;
      if (
        token &&
        token_decoded.split(':').length > 0 &&
        token_decoded.split(':')[1] ===
          this.configService.get('SECRET_ADMIN_TOKEN')
      ) {
        return true;
      } else {
        // Passport -> 401
        return false;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Token E');
    }
  }

  getToken = (authorization) => {
    const tokenBase64 =
      authorization && authorization.split(' ').length > 0
        ? authorization.split(' ')[1]
        : false;
    return tokenBase64;
  };
}
