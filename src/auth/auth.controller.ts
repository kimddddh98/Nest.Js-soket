import { Controller, Body, Post, Headers, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('token/access')
  postAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)
    const newToken = this.authService.rotateToken(token, false)
    return {
      accessToken: newToken
    }
  }
  @Post('token/refresh')
  postRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const newToken = this.authService.rotateToken(token, false)
    return {
      refreshToken: newToken
    }
  }
  @Post('login/email')
  async loginEmail(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const credentials = this.authService.decodeBasicToken(token)

    const { accessToken, refreshToken } =
      await this.authService.loginWithEmail(credentials)
    // re

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })

    return {
      accessToken,
      refreshToken
    }
    // return true
    // return this.authService.loginWithEmail(credentials)
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
