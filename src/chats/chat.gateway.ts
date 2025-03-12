import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto'
import { RoomsService } from 'src/rooms/rooms.service'
import { ChatsService } from './chats.service'
import { EnterRoomDto } from './dto/enter-room.dto'
import { join } from 'path'
import { CreateMessageDto } from './messages/dto/create-message.dto'
import { MessagesService } from './messages/messages.service'

@WebSocketGateway({
  /**
   * 네임스페이스 설정
   * ws://localhost:4000/chats
   */

  namespace: 'chats'
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatsService,
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService
  ) {}
  @WebSocketServer()
  server: Server

  handleConnection(soket: Socket) {
    console.log('connection', soket.id)
    return soket.id
  }

  @SubscribeMessage('create_room')
  async createRoom(
    @MessageBody() data: CreateRoomDto,
    @ConnectedSocket() soket: Socket
  ) {
    const rooms = await this.roomsService.create(data)
  }

  /**
   * 일반 소켓 으로 구현한다면 아래와 같음
   * soket.on('message', (data) => {
   *   console.log(data)
   * })
   *
   */
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() soket: Socket
  ) {
    console.log(dto)

    const exists = await this.roomsService.checkExistsRoom(dto.roomId)
    if (!exists) {
      throw new WsException({
        message: `존재하지 않는 roomId , roomId : ${dto.roomId}`
      })
    }

    const message = await this.messagesService.createMessage(dto)
    /**
     * server.in 메서드를 사용하여 방에 속한 모든 클라이언트에게 메시지를 보낼 수 있음
     * this.server.in(data.roomId.toString()).emit('receive_message', data.message)
     */

    /**
     * soket.to 메서드를 사용하여 자신을 제외한 방에 속한 모든 클라이언트에게 메시지를 보낼 수 있음
     */
    soket.to(message.room.id.toString()).emit('receive_message', message)
  }

  @SubscribeMessage('enter_room')
  async enterRoom(
    @MessageBody() data: EnterRoomDto,
    @ConnectedSocket() soket: Socket
  ) {
    for (const roomId of data.roomIds) {
      const exists = await this.roomsService.checkExistsRoom(roomId)
      console.log(exists)
      if (!exists) {
        throw new WsException({
          message: `존재하지 않는 roomId , roomId : ${roomId}`
        })
      }
    }
    soket.join(data.roomIds.map(d => d.toString()))
    console.log('join', data.roomIds)
    // for (const roomId of data) {
    //   soket.join(roomId.toString())
    //   console.log('join', roomId)
    // }
  }
}
