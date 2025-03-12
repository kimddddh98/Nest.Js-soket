import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto'
import { RoomsService } from 'src/rooms/rooms.service'
import { ChatsService } from './chats.service'

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
    private readonly roomsService: RoomsService
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
  sendMessage(
    @MessageBody() data: { roomId: number; message: string },
    @ConnectedSocket() soket: Socket
  ) {
    console.log(data)

    /**
     * server.in 메서드를 사용하여 방에 속한 모든 클라이언트에게 메시지를 보낼 수 있음
     * this.server.in(data.roomId.toString()).emit('receive_message', data.message)
     */

    /**
     * soket.to 메서드를 사용하여 자신을 제외한 방에 속한 모든 클라이언트에게 메시지를 보낼 수 있음
     */
    soket.to(data.roomId.toString()).emit('receive_message', data.message)
  }

  @SubscribeMessage('enter_room')
  enterRoom(@MessageBody() data: number[], @ConnectedSocket() soket: Socket) {
    for (const roomId of data) {
      soket.join(roomId.toString())
      console.log('join', roomId)
    }
  }
}
