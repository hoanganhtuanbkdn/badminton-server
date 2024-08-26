import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { HttpService } from '@nestjs/axios';
import { S3 } from 'aws-sdk';
import { readdir, unlink } from 'fs';
import { lastValueFrom } from 'rxjs';
import { PpeService } from './ppe/services/ppe.service';
import { FilesService } from './shared/services/file/files.service';

@Injectable()
export class AppService {
  constructor(
    private readonly filesService: FilesService,
    private readonly ppeService: PpeService,
    private readonly httpService: HttpService,
  ) {
  }

  // @Cron("0 32 16 * * 1-5", { timeZone: 'America/Los_Angeles' })
  async getHello(): Promise<string> {
    return 'Hello World from website pacific!!';
  }

  // all rate
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async JOB_allRate() {
    console.log('-----EVERY_DAY_AT_MIDNIGHT JOB_allRate CronExpression---- ');
    await this.ppeService.getAllRateJob();
    return true;
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_10AM, { timeZone: 'America/Los_Angeles' })
  async JOB_sendMailNotifyMeMethod3() {
    console.log('-----EVERY_DAY_AT_MIDNIGHT JOB_sendMailNotifyMeMethod3 CronExpression---- ');
    await this.ppeService.jobNotifyRate(3);
    return true;
  }

  @Cron('0 0 10 * * 1', { timeZone: 'America/Los_Angeles' }) // MONDAY_AT_10AM
  async JOB_sendMailNotifyMeMethod2() {
    console.log('-----EVERY_DAY_AT_MIDNIGHT JOB_sendMailNotifyMeMethod2 CronExpression---- ');
    await this.ppeService.jobNotifyRate(2);
    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { timeZone: 'America/Los_Angeles' })
  async JOB_sendMailNotifyMeMethod1() {
    console.log('-----EVERY_DAY_AT_MIDNIGHT JOB_sendMailNotifyMeMethod1 CronExpression---- ');
    await this.ppeService.jobNotifyRate(1);
    return true;
  }

  // // historicalRate chart
  @Cron(CronExpression.EVERY_DAY_AT_1AM, { timeZone: 'America/Los_Angeles' })
  async JOB_historicalRates() {
    console.log('-----EVERY_DAY_AT_MIDNIGHT JOB_sendMailNotifyMeMethod1 CronExpression---- ');
    await this.ppeService.historicalRates(null);
    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { timeZone: 'America/Los_Angeles' })
  async JOB_sendTodayMail() {
    console.log('-----EVERY_DAY_AT_2AM getAllLeadOnSalesForce CronExpression---- ');
    await this.ppeService.getAllLeadOnSalesForce();
    return true;
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'America/Los_Angeles' })
  async JOB_deleteIDXData() {
    readdir('src/trestle/data', (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      files.forEach(file => {
        unlink(`src/trestle/data/${file}`, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('File deleted successfully');
        });
      });
    });


  }

  addAvatar(imageBuffer: Buffer, filename: string, mimetype: string): Promise<S3.ManagedUpload.SendData> {
    return this.filesService.uploadPublicFile(imageBuffer, filename, mimetype);
  }

  suggestionMaps(input: string) {
    console.log('input', input);
    const GOOGLE_PLACE_KEY = process.env.GOOGLE_PLACE_KEY;
    return lastValueFrom(
      this.httpService.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_PLACE_KEY}&components=country:us`,
      ),
    )
      .then(async (resp) => {
        console.log('resp', resp);
        return resp.data;
      })
      .catch((err) => {
        console.log(err, 'err');
        throw new NotFoundException(err.message);
      });
  }

  addressDetail(input: string) {
    console.log('input', input);
    const GOOGLE_PLACE_KEY = process.env.GOOGLE_PLACE_KEY;
    return lastValueFrom(
      this.httpService.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${input}&key=${GOOGLE_PLACE_KEY}&fields=formatted_address,address_components,adr_address,geometry`,
      ),
    )
      .then(async (resp) => {
        console.log('resp', resp);
        return resp.data;
      })
      .catch((err) => {
        console.log(err, 'err');
        throw new NotFoundException(err.message);
      });
  }

}
