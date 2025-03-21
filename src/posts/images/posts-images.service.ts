import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageModel } from 'src/common/entities/image.entity'
import { QueryRunner, Repository } from 'typeorm'
import { CreatePostImageDto } from '../dto/image/create-post-image.dto'
import { basename, join } from 'path'
import {
  POST_UPLOAD_FOLDER_PATH,
  TEMP_FOLDER_PATH
} from 'src/common/const/path.const'
import { promises } from 'fs'

@Injectable()
export class PostsImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(ImageModel) : this.imageRepository
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr)

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path)

    try {
      await promises.access(tempFilePath)
    } catch (e) {
      throw new BadRequestException('파일이 존재하지 않습니다.')
    }

    const fileName = basename(tempFilePath)

    const newFilePath = join(POST_UPLOAD_FOLDER_PATH, fileName)

    const result = await repository.save({
      ...dto
    })
    await promises.rename(tempFilePath, newFilePath)

    return result
  }
}
