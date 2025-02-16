import { BaseModel } from 'src/common/entities/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class RoomsModel extends BaseModel {
  @ManyToOne(() => UsersModel, user => user.rooms, {
    nullable: false
  })
  createUser: UsersModel

  @Column({
    length: 20
  })
  roomName: string
}
