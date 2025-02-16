import { ValidationArguments } from 'class-validator'

export const emailMessage = (arg: ValidationArguments) => {
  return `${arg.property}는 올바른 이메일 형식이어야 합니다.`
}
