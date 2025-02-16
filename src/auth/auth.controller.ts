import { Controller, Body, Post, Headers, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { BasicTokenGuard } from './guard/basic-token.guard'
import { RegisterUserDto } from './dto/register-user.dto'
import { RefreshTokenGuard } from './guard/bearer-token.guard'
// import {  } from './guard/bearer-token.guard'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)
    const newToken = this.authService.rotateToken(token, false)
    return {
      accessToken: newToken
    }
  }
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const newToken = this.authService.rotateToken(token, false)
    return {
      refreshToken: newToken
    }
  }
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginEmail(
    @Headers('authorization') rawToken: string
    // @Res({ passthrough: true }) res: Response
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const credentials = this.authService.decodeBasicToken(token)

    const { accessToken, refreshToken } =
      await this.authService.loginWithEmail(credentials)

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none'
    // })
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none'
    // })

    return {
      accessToken,
      refreshToken
    }
    // return true
    // return this.authService.loginWithEmail(credentials)
  }

  @Post('register/email')
  registerWithEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body)
  }
}
