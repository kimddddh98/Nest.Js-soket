import { Injectable } from '@nestjs/common'
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
  async createUser(nickname: string, email: string, password: string) {
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
}
