import { Controller, Body, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.loginWithEmail({ email, password })
  }

  @Post('resister/email')
  resisterWithEmail(
    @Body('email') email: string,
    @Body('nickname') nickname: string,
    @Body('password') password: string
  ) {
    return this.authService.resisterWithEmail({ email, nickname, password })
  }
}
