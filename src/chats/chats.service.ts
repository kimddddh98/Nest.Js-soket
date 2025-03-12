import { Injectable } from '@nestjs/common'
import { RoomsService } from 'src/rooms/rooms.service'

@Injectable()
export class ChatsService {
  constructor(private readonly roomsService: RoomsService) {}
}
