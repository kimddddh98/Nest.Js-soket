import {
  CanActivate,
  ExecutionContext,
  NotFoundException
} from '@nestjs/common'
import { RoomsService } from '../rooms.service'

export class RoomGuard implements CanActivate {
  constructor(private readonly roomService: RoomsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { id } = request.params

    const room = await this.roomService.findOne(id)

    if (!room) {
      throw new NotFoundException('룸가드 적용 채팅방이 존재하지 않습니다.')
    }

    request.room = room
    return true
  }
}
