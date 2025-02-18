import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from 'src/users/decorator/user.decorator'
import { UsersModel } from 'src/users/entities/users.entity'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // 채팅방 생성
  @Post()
  @UseGuards(AccessTokenGuard)
  create(@User() user: UsersModel, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(user, createRoomDto)
  }

  // 채팅방 목록 조회
  @Get()
  @UseGuards(AccessTokenGuard)
  findAllRooms(@User() user: UsersModel) {
    return this.roomsService.findAllRoom(user)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id)
  }
}
