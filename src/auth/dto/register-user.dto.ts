import { PickType } from '@nestjs/mapped-types'
import { UsersModel } from 'src/users/entities/users.entity'
import { IsString, Length } from 'class-validator'
import { lengthMessage } from 'src/common/validation-message/length.message'

export class RegisterUserDto extends PickType(UsersModel, [
  'email',
  'password'
]) {
  @IsString({ message: lengthMessage })
  @Length(1, 20, { message: lengthMessage })
  nickname: string
}
