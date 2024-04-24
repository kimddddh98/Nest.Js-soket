import {
  PipeTransform,
  ArgumentMetadata,
  Injectable,
  BadRequestException
} from '@nestjs/common'

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < 8) {
      throw new BadRequestException('비밀번호를 8자 이상 입력해주세요.')
    }

    return value.toString()
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(
        `비밀번호의 최대 길이는 ${this.length}자 입니다.`
      )
    }
    return value.toString()
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.length) {
      throw new BadRequestException(
        `비밀번호의 최소 길이는 ${this.length}자 입니다.`
      )
    }
    return value.toString()
  }
}
