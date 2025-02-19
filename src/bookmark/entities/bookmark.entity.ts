import { BaseModel } from 'src/common/entities/base.entity'
import { RoomsModel } from 'src/rooms/entities/rooms.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Entity, ManyToOne } from 'typeorm'

@Entity()
export class BookmarkModel extends BaseModel {
  @ManyToOne(() => UsersModel, user => user.bookmarks, { onDelete: 'CASCADE' })
  user: UsersModel

  @ManyToOne(() => RoomsModel, room => room.bookmarks, { onDelete: 'CASCADE' })
  room: RoomsModel
}
