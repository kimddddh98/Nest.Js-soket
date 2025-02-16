import { PartialType } from '@nestjs/mapped-types'
import { CreatePostDto } from './create-post.dto'
import { IsOptional, IsString } from 'class-validator'
import { stringMessage } from 'src/common/validation-message/string.message'

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({
    message: stringMessage
  })
  @IsOptional()
  title?: string
  @IsString({
    message: stringMessage
  })
  @IsOptional()
  content?: string
}
