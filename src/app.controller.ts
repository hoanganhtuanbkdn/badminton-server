import { MailerService } from '@nestjs-modules/mailer';
import { ClassSerializerInterceptor, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { S3 } from 'aws-sdk';
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

}
