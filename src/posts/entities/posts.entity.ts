import { BaseModel } from 'src/common/entities/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { IsString } from 'class-validator'
import { stringMessage } from 'src/common/validation-message/string.message'
import { ImageModel } from 'src/common/entities/image.entity'
@Entity()
export class PostModel extends BaseModel {
  @ManyToOne(() => UsersModel, user => user.posts, {
    nullable: false
  })
  author: UsersModel
  @Column()
  @IsString({
    message: stringMessage
  })
  title: string
  @Column()
  @IsString({
    message: stringMessage
  })
  content: string
  @Column()
  likeCount: number
  @Column()
  commentCount: number

  @OneToMany(() => ImageModel, image => image.post)
  images: ImageModel[]
}
