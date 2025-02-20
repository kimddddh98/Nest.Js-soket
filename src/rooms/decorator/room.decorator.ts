import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'
import { RoomsModel } from '../entities/rooms.entity'

export const Room = createParamDecorator(
  (roomKey: keyof RoomsModel | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      throw new InternalServerErrorException('user 정보를 가져오지 못했습니다.')
    }

    if (roomKey) {
      return user[roomKey]
    }
    return user
  }
)
