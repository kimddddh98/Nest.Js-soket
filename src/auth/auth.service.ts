import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersModel } from 'src/users/entities/users.entity'
import { HASH_ROUND, JWT_SECRET } from './const/auth.const'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly UsersSevice: UsersService
  ) {}
  /* 
    resisterWithEmail 회원가입
      - 이메일, 비밀번호, 닉네임을 입력받아 사용자 생성  
      - 완료시 엑세스토큰, 리프레쉬토큰 발급
      - 회원가입시 바로 로그인

    loginWithEmail 로그인
      - 이메일 비밀번호를 받아 검증진행
      -authenticateWithEmailPassword()를 이용하여 검증
      -검증완료시 반환된 사용자정보를 기반으로 토큰을 만든다
      - 완료시 엑세스토큰, 리프레쉬토큰 발급
    
    loginUser
      - 회원가입,로그인시 검증완료 후 액세스토큰, 리프레쉬토큰 반환하는 로직

    signToken
      -loginUser() 에서 필요한 토큰을 생성(사인)
    
    authenticateWithEmailPassword
      -loginWithEmail() 실행시 필요한 검증 진행
      -사용자 이메일이 존재하는지 확인
      -비밀번호가 맞는지
      -검증완료시 사용자 정보 반환


  */
  /* 
    payload
    1. email
    2. sub(사용자아이디)
    3. type : access | refresh
  */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken
    }
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300
    })
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true)
    }
  }

  async authenticateWithEmailPassword(
    user: Pick<UsersModel, 'email' | 'password'>
  ) {
    // -사용자 이메일이 존재하는지 확인
    //  확인하려면 userRepository 사용필요
    const existUser = await this.UsersSevice.findUserEmail(user.email)
    if (!existUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.')
    }

    // const findUser = await this.userRepository.

    // -비밀번호가 맞는지
    // compare : 입력된 비밀번호, 데이터베이스의 비밀번호
    const isPasswordCheck = await bcrypt.compare(
      user.password,
      existUser.password
    )
    if (!isPasswordCheck) {
      throw new UnauthorizedException('비밀번호가 맞지않습니다.')
    }

    // -검증완료시 사용자 정보 반환
    return existUser
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existUser = await this.authenticateWithEmailPassword(user)

    return this.loginUser(existUser)
  }

  async resisterWithEmail(
    user: Pick<UsersModel, 'email' | 'password' | 'nickname'>
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUND)
    const newUser = await this.UsersSevice.createUser({
      ...user,
      password: hash
    })
    return this.loginUser(newUser)
  }
}
