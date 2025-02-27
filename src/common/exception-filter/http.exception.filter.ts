import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse()
    const request = context.getRequest()
    const status = exception.getStatus()

    /**
     * 보통은 에러를 변경해서 보내주진 않음
     * 로그를 남기거나 에러시스템에 저장하거나 하는 용도로 사용
     */

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url
    })
  }
}
