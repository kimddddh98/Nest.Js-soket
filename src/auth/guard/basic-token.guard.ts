import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const rawToken = request.headers['authorization']
    if (!rawToken) {
      throw new UnauthorizedException('권한이 없습니다.')
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false)
    const { email, password } = this.authService.decodeBasicToken(token)

    const user = await this.authService.authenticateWithEmailPassword({
      email,
      password
    })

    request.user = user

    return Promise.resolve(true)
  }
}
