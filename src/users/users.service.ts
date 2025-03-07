import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersModel } from './entities/users.entity'
import { Repository } from 'typeorm'
import {
  ProfileModel,
  ProfilePublicType
} from 'src/profile/entities/profile.entity'
import { RegisterUserDto } from 'src/auth/dto/register-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userReposittory: Repository<UsersModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>
  ) {}
  // 생성
  async createUser({ email, nickname, password }: RegisterUserDto) {
    const checkNickname = await this.profileRepository.exist({
      where: {
        nickname
      }
    })
    if (checkNickname) {
      throw new BadRequestException('존재하는 닉네임입니다.')
    }

    const checkEmail = await this.userReposittory.exist({
      where: {
        email
      }
    })
    if (checkEmail) {
      throw new BadRequestException('이미 가입한 이메일입니다.')
    }

    const user = this.userReposittory.save({
      email,
      password,
      profile: {
        nickname
      }
    })

    return user
  }

  // 조회
  async getUsers(userId: number) {
    const users = await this.userReposittory.find({
      where: [
        {
          profile: {
            publicType: ProfilePublicType.PUBLIC
          }
        },
        {
          id: userId
        }
      ]
    })
    return users
  }
  async findUserEmail(email: string) {
    return await this.userReposittory.findOne({
      where: {
        email
      }
    })
  }

  // 상세조회
  async getUser(id: number) {
    const user = await this.userReposittory.findOne({
      where: {
        id
      }
    })
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.')
    }
    return user
  }
}
