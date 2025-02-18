import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersModel } from './entities/users.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userReposittory: Repository<UsersModel>
  ) {}
  // 생성
  async createUser({
    email,
    nickname,
    password
  }: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    const checkNickname = await this.userReposittory.exist({
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

    const user = this.userReposittory.create({
      nickname,
      email,
      password
    })

    const newUser = await this.userReposittory.save(user)
    return newUser
  }

  // 조회
  async getUsers() {
    const users = await this.userReposittory.find()
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
