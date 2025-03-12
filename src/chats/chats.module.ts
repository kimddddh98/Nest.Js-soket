import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { ChatGateway } from './chat.gateway'
import { RoomsModule } from 'src/rooms/rooms.module'
import { MessagesService } from './messages/messages.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessagesModel } from './entities/messages.entity'
import { CommonModule } from 'src/common/common.module'

@Module({
  imports: [
    RoomsModule,
    CommonModule,
    TypeOrmModule.forFeature([MessagesModel])
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway, MessagesService]
})
export class ChatsModule {}
