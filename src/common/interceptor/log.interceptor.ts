import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { map, Observable, tap } from 'rxjs'

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    /**
     * 구현할 로그
     * [Request] {path} {요청 시간 timestamp}
     * [Response] {path} {응답시간 timestamp} {응답완료될때까지 걸린 시간ms}
     */
    const now = new Date()

    const req = context.switchToHttp().getRequest()
    const method = req.method
    const path = req.originalUrl

    console.log(`[Request] {${method}} {${path}} {${now.toLocaleString('kr')}}`)

    return next.handle().pipe(
      tap(observerOrNext =>
        console.log(
          `[Response] {${method}} {${path}} {${now.toLocaleString('kr')}} {${
            new Date().getMilliseconds() - now.getMilliseconds()
          }ms}`
        )
      ),
      map(data => {
        return {
          data,
          message: 'success'
        }
      })
    )
  }
}
