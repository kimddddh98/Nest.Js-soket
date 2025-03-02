import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne
} from 'typeorm'
import { RolesEnum } from '../const/roles.const'
import { PostModel } from 'src/posts/entities/posts.entity'
import { BaseModel } from 'src/common/entities/base.entity'
import { IsString, Length, IsEmail, IsEnum } from 'class-validator'
import { lengthMessage } from 'src/common/validation-message/length.message'
import { stringMessage } from 'src/common/validation-message/string.message'
import { emailMessage } from 'src/common/validation-message/email.message'
import { Exclude, Expose, Transform } from 'class-transformer'
import { RoomsModel } from 'src/rooms/entities/rooms.entity'
import { BookmarkModel } from 'src/bookmark/entities/bookmark.entity'
import {
  ProfileModel,
  ProfilePublicType
} from 'src/profile/entities/profile.entity'
@Entity()
export class UsersModel extends BaseModel {
  // 중복안됨 , 20자 이하

  // 중복안됨
  @Column({
    unique: true
  })
  @IsString({
    message: stringMessage
  })
  @IsEmail(
    {},
    {
      message: emailMessage
    }
  )
  @Expose()
  email: string

  @Column()
  @IsString({ message: stringMessage })
  @Length(8, 15, {
    message: lengthMessage
  })
  @Exclude({
    toPlainOnly: true
  })
  password: string

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER
  })
  role: RolesEnum

  @OneToMany(() => PostModel, post => post.author)
  posts: PostModel[]

  @Expose()
  @OneToMany(() => RoomsModel, room => room.createUser)
  rooms: RoomsModel[]

  @Expose()
  @OneToMany(() => BookmarkModel, bookmark => bookmark.user)
  bookmarks: BookmarkModel[]

  @Exclude()
  @OneToOne(() => ProfileModel, profile => profile.user, {
    cascade: true,
    eager: true
  })
  profile: ProfileModel

  @Expose()
  @Transform(({ obj }) => obj.profile?.nickname)
  nickname: string

  @Expose()
  @Transform(({ obj }) => obj.profile?.profileImg)
  profileImg: string

  @Expose() //
  @Transform(({ obj }) => obj.profile?.publicType)
  @IsEnum(ProfilePublicType)
  publicType: ProfilePublicType

  //내가 속한 방들
  @Expose()
  @ManyToMany(() => RoomsModel, room => room.userList)
  @JoinTable()
  myRooms: RoomsModel[]
}
