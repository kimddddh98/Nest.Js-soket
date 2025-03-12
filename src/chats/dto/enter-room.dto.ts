import { IsNumber } from 'class-validator'

export class EnterRoomDto {
  @IsNumber({}, { each: true })
  roomIds: number[]
}
