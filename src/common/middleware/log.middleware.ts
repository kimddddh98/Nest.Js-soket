import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('미들웨어 로그')
    next()
  }
}
