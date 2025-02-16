import { Injectable } from '@nestjs/common'
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

  remove(id: number) {
    return `This action removes a #${id} room`
  }
}
