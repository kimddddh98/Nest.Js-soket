import { BookmarkModel } from 'src/bookmark/entities/bookmark.entity'
import { MessagesModel } from 'src/chats/entities/messages.entity'
import { BaseModel } from 'src/common/entities/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'

@Entity()
export class RoomsModel extends BaseModel {
  // @ManyToOne(() => UsersModel, user => user.rooms, {
  //   nullable: false
  // })
  // createUser: UsersModel

  @OneToMany(() => BookmarkModel, bookmark => bookmark.room)
  bookmarks: BookmarkModel[]

  @Column({
    length: 20
  })
  roomName: string

  @ManyToMany(() => UsersModel, user => user.rooms, {
    onDelete: 'CASCADE'
  })
  userList: UsersModel[]

  @OneToMany(() => MessagesModel, messages => messages.room)
  messages: MessagesModel
}
