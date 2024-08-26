import { MailerService } from '@nestjs-modules/mailer';
import { ClassSerializerInterceptor, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { S3 } from 'aws-sdk';
import { FileUploadDto } from './agency/dtos/file-upload.dto';
import { AppService } from './app.service';
import { Public } from './shared/decorators/public.decorator';
import { OpenApiUploadImage } from './shared/decorators/swagger-response/upload-image.decorator';
import { AppLogger } from './shared/logger/logger.service';
import { FilesService } from './shared/services/file/files.service';

@ApiTags('common')
@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
    private readonly filesService: FilesService,
    private mailerService: MailerService
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get('hello-world')
  @ApiOperation({
    summary: 'Server health check API',
  })
  getHello() {
    return this.appService.getHello();
  }

  // @Get('test-mail')
  // @ApiOperation({
  //   summary: 'Server health check API',
  // })
  // async testMail() {

  //   await this.mailerService.sendMail({
  //     to: "hungvu.it.94@gmail.com",
  //     subject: '[Pacificwide] New User Feedback Received',
  //     template: './feedback_to_agency',
  //     context: {
  //       customerName: "customerName",
  //       domain: process.env.FE_DOMAIN,
  //       star: 5,
  //       comment: "comment",
  //       link: process.env.FE_DOMAIN_ADMIN_PORTAL + "link",
  //     },
  //   });

  //   return "ok";
  // }




  @Public() // <--- Set register as public route
  @Post('upload-image')
  @OpenApiUploadImage()
  //@UseGuards(IsMineGuard) // <--- Prevent user from updating other user's data
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload-profile-image',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  uploadFile(@UploadedFile() file): Promise<S3.ManagedUpload.SendData> {
    return this.appService.addAvatar(file.buffer, file.originalname, file.mimetype);
  }

  @Public() // <--- Set register as public route
  @Get('google-suggestion-maps/:input')
  @ApiOperation({
    summary: 'Get map suggestion data from Google',
  })
  googleSuggestionMaps(@Param('input') input: string) {
    return this.appService.suggestionMaps(input);
  }

  @Public() // <--- Set register as public route
  @Get('address-detail/:input')
  @ApiOperation({
    summary: 'Get map suggestion data from Google',
  })
  addressDetail(@Param('input') input: string) {
    return this.appService.addressDetail(input);
  }
}
