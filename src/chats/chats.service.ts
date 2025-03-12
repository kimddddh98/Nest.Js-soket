import { Injectable } from '@nestjs/common'
import { RoomsService } from 'src/rooms/rooms.service'
import { MessagesService } from './messages/messages.service'

@Injectable()
export class ChatsService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService
  ) {}
}
