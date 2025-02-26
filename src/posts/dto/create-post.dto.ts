import { IsOptional, IsString } from 'class-validator'
import { PostModel } from '../entities/posts.entity'
import { PickType } from '@nestjs/mapped-types'

export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {
  @IsString({
    each: true
  })
  @IsOptional()
  images?: string[] = []
}
