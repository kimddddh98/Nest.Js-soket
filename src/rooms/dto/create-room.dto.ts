import { RoomsModel } from '../entities/rooms.entity'
import { IsString, Length, IsOptional } from 'class-validator'
import { PickType } from '@nestjs/mapped-types'

export class CreateRoomDto extends PickType(RoomsModel, ['roomName']) {
  @IsString()
  @IsOptional()
  @Length(1, 20, {
    message: '방 이름은 1자 이상 20자 이하여야 합니다.'
  })
  roomName: string
}
