import { PickType } from '@nestjs/mapped-types'
import { IsNumber } from 'class-validator'
import { RoomsModel } from '../entities/rooms.entity'

export class InviteRoomDto extends PickType(RoomsModel, ['id']) {
  @IsNumber()
  inviteUserId: number
}
