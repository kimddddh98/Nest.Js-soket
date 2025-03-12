import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { ChatGateway } from './chat.gateway'
import { RoomsModule } from 'src/rooms/rooms.module'

@Module({
  imports: [RoomsModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway]
})
export class ChatsModule {}
