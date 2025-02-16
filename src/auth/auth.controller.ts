import { Controller, Body, Post, Headers, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe'
import { BasicTokenGuard } from './guard/basic-token.guard'
import { ResisterUserDto } from './dto/resister-user.dto'
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

  @Post('resister/email')
  resisterWithEmail(@Body() body: ResisterUserDto) {
    return this.authService.resisterWithEmail(body)
  }
}
