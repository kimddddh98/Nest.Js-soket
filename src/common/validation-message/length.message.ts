import { ValidationArguments } from 'class-validator'

export const lengthMessage = (arg: ValidationArguments) => {
  const args = arg.constraints

  if (args.length === 1) {
    return `${arg.property}은 ${args[0]}자 이상이어야 합니다.`
  }
  if (args.length === 2) {
    return `${arg.property}은 ${args[0]}자 이상 ${args[1]}자 이하여야 합니다.`
  }
  return `${arg.property}은 ${args[0]}자 이상 ${args[1]}자 이하여야 합니다.`
}
