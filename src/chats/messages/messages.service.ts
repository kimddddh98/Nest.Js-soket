import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessagesModel } from '../entities/messages.entity'
import { Repository } from 'typeorm'
import { CommonService } from 'src/common/common.service'
import { MessagesPaginationDto } from './dto/messages-pagination.dto'
import { CreateMessageDto } from './dto/create-message.dto'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService
  ) {}
  paginateMessages(dto: MessagesPaginationDto, cid: number) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      {
        where: {
          room: {
            id: cid
          }
        },
        relations: {
          user: true
          // room: true
        }
      },
      `chats/${cid}/messages`
    )
  }

  async createMessage(dto: CreateMessageDto) {
    const message = await this.messagesRepository.save({
      messageTxt: dto.messageTxt,
      user: {
        id: dto.userId
      },
      room: {
        id: dto.roomId
      }
    })
    return this.messagesRepository.findOne({
      where: {
        id: message.id
      },
      relations: {
        room: true,
        user: true
      }
    })
  }
}
