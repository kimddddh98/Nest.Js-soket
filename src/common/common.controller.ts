import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { CommonService } from './common.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.commonService.uploadImage(image)
  }
}
