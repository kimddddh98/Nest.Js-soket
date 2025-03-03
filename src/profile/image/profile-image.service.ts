import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageModel } from 'src/common/entities/image.entity'
import { QueryRunner, Repository } from 'typeorm'
import { CreateProfileImageDto } from '../dto/create-profile-image.dto'
import {
  PROFILE_UPLOAD_FOLDER_PATH,
  TEMP_FOLDER_PATH
} from 'src/common/const/path.const'
import { basename, join } from 'path'
import { promises } from 'fs'
import { profile } from 'console'

@Injectable()
export class ProfileImageService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>
  ) {}
  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(ImageModel) : this.imageRepository
  }
  async createProfileImage(dto: CreateProfileImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr)

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path)

    try {
      await promises.access(tempFilePath)
    } catch (e) {
      throw new BadRequestException('파일이 존재하지 않습니다.')
    }
    console.log('여기는 통과?')
    const fileName = basename(tempFilePath)

    const newFilePath = join(PROFILE_UPLOAD_FOLDER_PATH, fileName)

    const result = await repository.upsert(
      { ...dto }, // ✅ 프로필과 연결된 이미지 업데이트
      { conflictPaths: ['profile'], skipUpdateIfNoValuesChanged: true } // ✅ 동일 프로필이면 업데이트
    )
    await promises.rename(tempFilePath, newFilePath)

    return result
  }
}
