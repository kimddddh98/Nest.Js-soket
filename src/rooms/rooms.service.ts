import {
  BadRequestException,
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
import { BookmarkModel } from 'src/bookmark/entities/bookmark.entity'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsModel)
    private readonly roomsRepository: Repository<RoomsModel>,
    @InjectRepository(BookmarkModel)
    private readonly bookmarkRepository: Repository<BookmarkModel>
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
      },
      relations: {
        bookmarks: {
          user: true
        }
      }
    })
    const bookmarkRooms = rooms.map(({ bookmarks, ...room }) => ({
      ...room,
      isBookmarked: bookmarks?.some(bookmark => bookmark?.user.id === user.id)
    }))
    return bookmarkRooms
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

  async bookmark(user: UsersModel, id: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        id,
        createUser: {
          id: user.id
        }
      },
      relations: {
        bookmarks: {
          user: true
        }
      }
    })
    if (!room) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }

    if (room.bookmarks?.some(bookmark => bookmark?.user.id === user?.id)) {
      // throw new BadRequestException('이미 채팅방을 즐겨찾기 했습니다.')
      const deleteBookmark = await this.bookmarkRepository.delete({
        user: {
          id: user.id
        },
        room: {
          id
        }
      })
      if (deleteBookmark.affected === 0) {
        throw new NotFoundException('채팅방을 즐겨찾기 해제할 수 없습니다.')
      }
      return {
        message: '채팅방을 즐겨찾기 해제했습니다.'
      }
    }
    const bookmark = this.bookmarkRepository.create({
      user,
      room
    })
    const saveBookmark = await this.bookmarkRepository.save(bookmark)
    return saveBookmark
  }
}
