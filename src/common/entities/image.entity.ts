import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseModel } from './base.entity'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  POST_UPLOAD_FOLDER_RELATIVE_PATH,
  PROFILE_UPLOAD_FOLDER_RELATIVE_PATH
} from '../const/path.const'
import { join } from 'path'
import { PostModel } from 'src/posts/entities/posts.entity'
import { ProfileModel } from 'src/profile/entities/profile.entity'

export enum ImageType {
  POST = 'POST',
  PROFILE = 'PROFILE'
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0
  })
  @IsInt()
  @IsOptional()
  order?: number

  @Column({
    enum: ImageType
  })
  @IsEnum(ImageType)
  @IsString()
  type: ImageType

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageType.POST) {
      return `/${join(POST_UPLOAD_FOLDER_RELATIVE_PATH, value)}`
    }
    if (obj.type === ImageType.PROFILE) {
      return `/${join(PROFILE_UPLOAD_FOLDER_RELATIVE_PATH, value)}`
    }
    return value
  })
  path: string

  @ManyToOne(() => PostModel, post => post.images)
  post: PostModel

  @OneToOne(() => ProfileModel, profile => profile.profileImg)
  @JoinColumn()
  profile: ProfileModel
}
