import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, SignUpDTO } from './dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    const access_token = this.authService.makeUserPayloadJWT(user);
    return { access_token };
  }

  @Post('signup')
  async signup(@Body() signupDTO: SignUpDTO): Promise<void> {
    const user = await this.authService.signUp(signupDTO);
  }
}
