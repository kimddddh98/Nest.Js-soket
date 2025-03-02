import { IsEnum, IsString, Length } from 'class-validator'
import { BaseModel } from 'src/common/entities/base.entity'
import { ImageModel } from 'src/common/entities/image.entity'
import { lengthMessage } from 'src/common/validation-message/length.message'
import { stringMessage } from 'src/common/validation-message/string.message'
import { UsersModel } from 'src/users/entities/users.entity'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

export enum ProfilePublicType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

@Entity()
export class ProfileModel extends BaseModel {
  @OneToOne(() => UsersModel, user => user.profile)
  @JoinColumn()
  user: UsersModel

  @OneToOne(() => ImageModel, image => image.profile, {
    nullable: true,
    eager: true
  })
  profileImg: ImageModel

  @Column({
    enum: ProfilePublicType,
    default: ProfilePublicType.PUBLIC
  })
  @IsEnum(ProfilePublicType)
  publicType: ProfilePublicType

  @Column({
    length: 20,
    unique: true
  })
  @IsString({
    message: stringMessage
  })
  @Length(1, 20, {
    message: lengthMessage
  })
  nickname: string
}
