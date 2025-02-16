import { ValidationArguments } from 'class-validator'

export const stringMessage = (arg: ValidationArguments) => {
  return `${arg.property}의 값이 문자열이 아닙니다.`
}
