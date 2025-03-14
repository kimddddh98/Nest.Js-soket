import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { UsersModel } from 'src/users/entities/users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomsModel } from './entities/rooms.entity'
import { FindManyOptions, Repository } from 'typeorm'
import { BookmarkModel } from 'src/bookmark/entities/bookmark.entity'
import { InviteRoomDto } from './dto/invite-room.dto'
import { CommonService } from 'src/common/common.service'
import { RoomsPaginationDto } from './dto/rooms-pagination.dto'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsModel)
    private readonly roomsRepository: Repository<RoomsModel>,
    @InjectRepository(BookmarkModel)
    private readonly bookmarkRepository: Repository<BookmarkModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly commonService: CommonService
  ) {}

  /** 채팅방 생성 */
  async create(createRoomDto: CreateRoomDto) {
    const { roomName, userIds } = createRoomDto
    const userNames: string[] = []
    for (const userId of userIds) {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId
        },
        relations: {
          profile: true
        }
      })
      if (!user) {
        throw new NotFoundException(`유저가 존재하지않습니다. id : ${userId}`)
      }
      userNames.push(user.profile.nickname)
    }

    const createRoom = this.roomsRepository.create({
      roomName: roomName ?? userNames.join(', '),
      userList: createRoomDto.userIds.map(id => ({ id }))
    })
    const saveRoom = await this.roomsRepository.save(createRoom)

    return saveRoom
  }

  /** 채팅방 조회 */
  paginateRooms(
    dto: RoomsPaginationDto,
    findOptions?: FindManyOptions<RoomsModel>
  ) {
    return this.commonService.paginate(
      dto,
      this.roomsRepository,
      {
        ...findOptions,
        relations: {
          bookmarks: {
            user: true
          }
        }
      },
      'rooms'
    )
  }

  checkingBookMark = (bookmarks: BookmarkModel[], user: UsersModel) => {
    const isBookmarked = bookmarks?.some(
      bookmark => bookmark?.user.id === user.id
    )
    return isBookmarked
  }

  async findAllRoom(user: UsersModel, dto: RoomsPaginationDto) {
    const rooms = await this.paginateRooms(dto, {
      where: {
        userList: {
          id: user.id
        }
      }
    })
    const bookmarkRooms = rooms.data.map(({ bookmarks, ...room }) => ({
      ...room,
      isBookmarked: this.checkingBookMark(bookmarks, user)
    }))

    return {
      ...rooms,
      data: bookmarkRooms
    }
  }

  async findOne(id: number, user: UsersModel) {
    const room = await this.roomsRepository.findOne({
      where: {
        id
      },
      relations: {
        userList: true,
        bookmarks: {
          user: true
        }
      }
    })
    if (!room) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }
    const { bookmarks, ...rest } = room
    const isBookmarked = this.checkingBookMark(bookmarks, user)
    return {
      ...rest,
      isBookmarked
    }
  }

  async checkExistsRoom(roomId: number) {
    const exists = await this.roomsRepository.exists({
      where: {
        id: roomId
      }
    })
    return exists
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`
  }

  async remove(user: UsersModel, id: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        id
      }
    })

    if (!room) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }
    // if (room.createUser.id !== user.id) {
    //   throw new ForbiddenException('삭제 권한이 없습니다.')
    // }

    const deleteRoom = await this.roomsRepository.delete(id)
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
        id
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

  async inviteRoom(inviteRoomDto: InviteRoomDto) {
    const { id, inviteUserId } = inviteRoomDto
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: {
        userList: true
      }
    })

    if (!room) {
      throw new NotFoundException('채팅방이 존재하지 않습니다.')
    }

    const user = await this.usersRepository.findOne({
      where: { id: inviteUserId }
    })

    if (!user) {
      throw new NotFoundException('초대할 유저가 존재하지 않습니다.')
    }

    if (room.userList.some(user => user.id === inviteUserId)) {
      throw new BadRequestException('이미 채팅방에 속해있습니다.')
    }

    room.userList.push(user)
    const saveRoom = await this.roomsRepository.save(room)
    return saveRoom
  }
}
