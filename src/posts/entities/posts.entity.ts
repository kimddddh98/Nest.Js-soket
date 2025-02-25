import { BaseModel } from 'src/common/entities/base.entity'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { IsString } from 'class-validator'
import { stringMessage } from 'src/common/validation-message/string.message'
import { Transform } from 'class-transformer'
import { join } from 'path'
import { POST_UPLOAD_FOLDER_RELATIVE_PATH } from 'src/common/const/path.const'
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

  @Column({
    nullable: true
  })
  @Transform(
    ({ value }) => value && `/${join(POST_UPLOAD_FOLDER_RELATIVE_PATH, value)}`
  )
  image?: string
}
