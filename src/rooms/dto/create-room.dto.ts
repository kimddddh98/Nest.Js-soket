import { RoomsModel } from '../entities/rooms.entity'
import { IsString, Length, IsOptional } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateRoomDto extends PartialType(RoomsModel) {
  @IsString()
  @IsOptional()
  @Length(1, 20, {
    message: '방 이름은 1자 이상 20자 이하여야 합니다.'
  })
  roomName?: string
}
