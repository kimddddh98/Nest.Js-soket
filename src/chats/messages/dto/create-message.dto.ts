import { PickType } from '@nestjs/mapped-types'
import { IsNumber } from 'class-validator'
import { MessagesModel } from 'src/chats/entities/messages.entity'

export class CreateMessageDto extends PickType(MessagesModel, ['messageTxt']) {
  @IsNumber()
  roomId: number

  @IsNumber()
  userId: number
}
