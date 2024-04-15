import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { RolesEnum } from '../const/roles.const'
import { PostModel } from 'src/posts/entities/posts.entity'

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number

  // 중복안됨 , 20자 이하
  @Column({
    length: 20,
    unique: true
  })
  nickname: string

  // 중복안됨
  @Column({
    unique: true
  })
  email: string

  @Column()
  password: string

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER
  })
  role: RolesEnum

  @OneToMany(() => PostModel, post => post.author)
  posts: PostModel[]
}
