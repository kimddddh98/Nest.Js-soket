import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'

export const QR = createParamDecorator(
  (key: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const qr = request.qr
    if (!qr) {
      throw new InternalServerErrorException('qr 정보를 가져오지 못했습니다.')
    }

    return qr
  }
)
