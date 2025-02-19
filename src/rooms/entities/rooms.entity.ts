import { BookmarkModel } from 'src/bookmark/entities/bookmark.entity'
import { BaseModel } from 'src/common/entities/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class RoomsModel extends BaseModel {
  @ManyToOne(() => UsersModel, user => user.rooms, {
    nullable: false
  })
  createUser: UsersModel

  @OneToMany(() => BookmarkModel, bookmark => bookmark.room)
  bookmarks: BookmarkModel[]

  @Column({
    length: 20
  })
  roomName: string
}
