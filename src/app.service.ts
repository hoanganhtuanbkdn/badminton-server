import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { HttpService } from '@nestjs/axios';
import { S3 } from 'aws-sdk';
import { readdir, unlink } from 'fs';
import { lastValueFrom } from 'rxjs';
import { FilesService } from './shared/services/file/files.service';

@Injectable()
export class AppService {
  constructor(
    private readonly filesService: FilesService,
    private readonly httpService: HttpService,
  ) {
  }
}
