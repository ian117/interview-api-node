import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDTO) {
    const user = await this.authService.login(
      loginDTO.email,
      loginDTO.password,
    );

    const access_token = this.authService.makeUserPayloadJWT(user);
    return { access_token };
  }

  @Post('signup')
  async signup(@Body() signupDTO): Promise<void> {
    const user = await this.authService.signUp(signupDTO);
  }
}
