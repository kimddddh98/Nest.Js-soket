import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor
} from '@nestjs/common'
import { catchError, Observable, tap } from 'rxjs'
import { DataSource } from 'typeorm'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    // 반환 형식 수정
    const request = context.switchToHttp().getRequest()

    const qr = this.dataSource.createQueryRunner()
    await qr.connect()

    await qr.startTransaction()
    request.qr = qr

    console.log('적용은 됐나')
    return next.handle().pipe(
      catchError(async e => {
        await qr.rollbackTransaction()
        await qr.release()
        throw new InternalServerErrorException(e.message)
      }),
      tap(async () => {
        await qr.commitTransaction()
        await qr.release()
      })
    )
  }
}
