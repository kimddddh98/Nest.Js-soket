import { IsString } from 'class-validator'
import { BaseModel } from 'src/common/entities/base.entity'
import { RoomsModel } from 'src/rooms/entities/rooms.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class MessagesModel extends BaseModel {
  @ManyToOne(() => RoomsModel, rooms => rooms.messages)
  room: RoomsModel

  @ManyToOne(() => UsersModel, users => users.messages)
  user: UsersModel

  @Column()
  @IsString()
  messageTxt: string
}
