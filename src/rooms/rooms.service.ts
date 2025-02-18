import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { UsersModel } from 'src/users/entities/users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomsModel } from './entities/rooms.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsModel)
    private readonly roomsRepository: Repository<RoomsModel>
  ) {}
  async create(user: UsersModel, createRoomDto: CreateRoomDto) {
    const createRoom = this.roomsRepository.create({
      roomName: createRoomDto.roomName ?? user.nickname,
      createUser: user
    })
    const saveRoom = await this.roomsRepository.save(createRoom)

    return saveRoom
  }

  async findAllRoom(user: UsersModel) {
    const rooms = await this.roomsRepository.find({
      where: {
        createUser: {
          id: user.id
        }
      }
    })
    return rooms
  }

  findOne(id: number) {
    return `This action returns a #${id} room`
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`
  }

  async remove(user: UsersModel, id: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        id
      },
      relations: {
        createUser: true
      }
    })

    if (!room) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }
    if (room.createUser.id !== user.id) {
      throw new ForbiddenException('삭제 권한이 없습니다.')
    }

    const deleteRoom = await this.roomsRepository.delete(id)
    console.log('deleteRoom', deleteRoom)
    if (deleteRoom.affected === 0) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }

    return {
      message: '채팅방이 삭제되었습니다.'
    }
  }
}
