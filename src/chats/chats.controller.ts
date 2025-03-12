import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { MessagesPaginationDto } from './messages/dto/messages-pagination.dto'
import { MessagesService } from './messages/messages.service'

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService
  ) {}

  @Get(':cid/messages')
  getMessages(
    @Query() dto: MessagesPaginationDto,
    @Param('cid', ParseIntPipe) cid: number
  ) {
    return this.messagesService.paginateMessages(dto, cid)
  }
}
