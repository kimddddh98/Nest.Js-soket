import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'
import { UsersModel } from '../entities/users.entity'

export const User = createParamDecorator(
  (userKey: keyof UsersModel | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      throw new InternalServerErrorException('user 정보를 가져오지 못했습니다.')
    }

    if (userKey) {
      return user[userKey]
    }
    return user
  }
)
