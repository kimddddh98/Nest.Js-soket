import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number
  // usermodel 과 연동 / foreign key
  // null 불가
  @ManyToOne(() => UsersModel, user => user.posts, {
    nullable: false
  })
  author: UsersModel
  @Column()
  title: string
  @Column()
  content: string
  @Column()
  likeCount: number
  @Column()
  commentCount: number
}
