import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersModel } from 'src/users/entities/users.entity'
import { ProfileModel } from './entities/profile.entity'
import { QueryRunner, Repository } from 'typeorm'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>
  ) {}
  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(ProfileModel) : this.profileRepository
  }

  async updateProfile(
    user: UsersModel,
    dto: UpdateProfileDto,
    qr?: QueryRunner
  ) {
    console.log('qr', !!qr)
    const repository = this.getRepository(qr)
    const isExist = await repository.exist({
      where: {
        nickname: dto.nickname
      }
    })
    if (isExist) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.')
    }

    const profile = await repository.findOne({
      where: {
        user: {
          id: user.id
        }
      }
    })
    if (!profile) {
      throw new BadRequestException('프로필이 존재하지 않습니다.')
    }
    profile.nickname = dto.nickname
    const newProfile = await repository.save(profile)

    return newProfile
  }
}
