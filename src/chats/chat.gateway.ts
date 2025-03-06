import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from "socket.io"

@WebSocketGateway({
  /**
   * 네임스페이스 설정
   * ws://localhost:4000/chats
   */

  namespace: 'chats'
})
export class ChatGateway implements OnGatewayConnection {
  handleConnection(soket: Socket) {
    console.log('connection', soket.id)
    return soket.id
  }

  /**
   * 일반 소켓 으로 구현한다면 아래와 같음
   * soket.on('message', (data) => {
   *   console.log(data)
   * })
   *
   */
  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() data: string) {
    console.log(data)
  }
}
