import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from '../auth.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const rawToken = request.headers['authorization']
    if (!rawToken) {
      throw new UnauthorizedException('권한이 없습니다.')
    }
    const token = this.authService.extractTokenFromHeader(rawToken, true)

    const result = this.authService.veriftToken(token)
    const user = await this.userService.findUserEmail(result.email)

    request.tokenType = result.type
    request.token = token
    request.user = user
    return true
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest()
    if (request.tokenType !== 'access') {
      throw new UnauthorizedException('access token이 필요합니다.')
    }

    return true
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest()

    if (request.tokenType !== 'refresh') {
      throw new UnauthorizedException('refresh token이 필요합니다.')
    }

    return true
  }
}
