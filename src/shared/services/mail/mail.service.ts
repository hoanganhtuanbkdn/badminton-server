import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { dollarFormat } from 'src/shared/constants';
import { NotifyMeFirstTimeType } from './interface/notifyMeFirstTimeType';
import { ShareMeType } from './interface/shareMeType';
// import querystring from 'querystring';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendTemporarilyLockAccountEmail(email: string, customerName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Lock account',
        template: './en_temporarily_lock_account',
        context: {
          customerName: customerName ? customerName : email,
          domain: process.env.FE_DOMAIN,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendMailNotifyMeFirstTime(email: string, data: NotifyMeFirstTimeType, dataRate, querySearch, alertFrequency = 3) {
    /* eslint-disable */
    const querystring = require('node:querystring');
    let { firstName, lastName, searchId, loanAmount, propertyAmount, targetMonthlyPayment, targetPoint } = data;
    const linkEditTracking = querystring.stringify({
      ...querySearch,
      searchId,
      editTracking: true,
    });

    const linkUnsubscribe = querystring.stringify({
      ...querySearch,
      searchId,
      unsubscribe: true,
    });

    loanAmount = dollarFormat(loanAmount);
    propertyAmount = dollarFormat(propertyAmount);
    targetMonthlyPayment = dollarFormat(targetMonthlyPayment);
    targetPoint = dollarFormat(targetPoint);


    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Notify alert from Pacificwide',
        template: alertFrequency === 1 ? './ppe_rate_tracking_setup_target' : 'ppe_rate_tracking_without_setup_target',
        context: {
          ...data,
          loanAmount,
          propertyAmount,
          targetMonthlyPayment,
          targetPoint,
          customerName: (!firstName && !lastName) ? email : firstName + ' ' + lastName,
          dataRate: dataRate,
          linkEditTracking: process.env.FE_DOMAIN + '/customized-rate?' + linkEditTracking,
          linkUnsubscribe: process.env.FE_DOMAIN + '/customized-rate?' + linkUnsubscribe,
          domain: process.env.FE_DOMAIN,
          currentRate: dataRate[0]?.rate,
        },
      });
    } catch (err) {
      console.log(3);

      console.log(err, 'err');
      return false;
    }
  }

  async sendMailTodayRate(
    email: string,
    data: { phone?: string; name?: string; email?: string },
    dataAllRate: {
      rate: number;
      apr: number;
      investor: string;
      credit: number;
      point: number;
      closingCost: number;
      payment: number;
      lastUpdate: string;
      price: number;
      principalAndInterest: number;
    }[],
  ) {
    const dataAllRateConvert = dataAllRate.filter((type) => type?.rate !== undefined);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Our best rates today',
        template: './ppe_send_today_rate',
        context: {
          ...data,
          customerName: data.name ? data.name : email,
          dataAllRate: dataAllRateConvert,
          domain: process.env.FE_DOMAIN,
          linkUnsubscribe: process.env.FE_DOMAIN + '/unsubscribe?email=' + email,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendMailShareMe(email: string, data: ShareMeType, querySearch) {
    /* eslint-disable */

    const querystring = require('node:querystring');

    const linkEditTracking = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      editTracking: true,
    });

    const linkUnsubscribe = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      unsubscribe: true,
    });

    let dataRate = data.dataRate.map((each) => {
      each['check'] = Number(each.credit) >= 0 ? true : false;
      each.credit = dollarFormat(each.credit);
      each.price = dollarFormat(each.price);
      each.principalAndInterest = dollarFormat(each.principalAndInterest);
      each.payment = dollarFormat(each.payment);
      each.closingCost = dollarFormat(each.closingCost);
      return each;
    });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Share rates from Pacificwide',
        template: './ppe_share_me',
        context: {
          customerName: (!data.firstName && !data.lastName) ? email : data.firstName + ' ' + data.lastName,
          loanAmount: dollarFormat(data.loanAmount),
          loanTerm: data.loanTerm,
          propertyAmount: dollarFormat(data.propertyAmount),
          occupancy: data.occupancy,
          propertyType: data.propertyType,
          zipCode: data.zipCode,
          creditScore: data.creditScore,
          loanPurpose: data.loanPurpose,
          dataRate: dataRate,
          linkEditTracking: process.env.FE_DOMAIN + '/customized-rate?' + linkEditTracking,
          linkUnsubscribe: process.env.FE_DOMAIN + '/customized-rate?' + linkUnsubscribe,
          time: data.time,
          domain: process.env.FE_DOMAIN,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      // return false;
    }
  }

  async sendMailShareMeCustomize(email: string, data: ShareMeType, querySearch) {
    /* eslint-disable */

    const querystring = require('node:querystring');

    const linkEditTracking = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      editTracking: true,
    });

    const linkUnsubscribe = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      unsubscribe: true,
    });

    let dataRate = data.dataRate.map((each) => {
      each['check'] = Number(each.credit) >= 0 ? true : false;
      each.credit = dollarFormat(each.credit);
      each.price = dollarFormat(each.price);
      each.principalAndInterest = dollarFormat(each.principalAndInterest);
      each.payment = dollarFormat(each.payment);
      each.closingCost = dollarFormat(each.closingCost);
      return each;
    });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Share rates from Pacificwide',
        template: './ppe_share_me',
        context: {
          customerName: (!data.firstName && !data.lastName) ? email : data.firstName + ' ' + data.lastName,
          loanAmount: dollarFormat(data.loanAmount),
          loanTerm: data.loanTerm,
          propertyAmount: dollarFormat(data.propertyAmount),
          occupancy: data.occupancy,
          propertyType: data.propertyType,
          zipCode: data.zipCode,
          creditScore: data.creditScore,
          loanPurpose: data.loanPurpose,
          dataRate: dataRate,
          linkEditTracking: process.env.FE_DOMAIN + '/customized-rate?' + linkEditTracking,
          linkUnsubscribe: process.env.FE_DOMAIN + '/customized-rate?' + linkUnsubscribe,
          time: data.time,
          domain: process.env.FE_DOMAIN,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      // return false;
    }
  }

  async sendMailShareHistoryAffordabilityCalculator(data: any) {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: '[Pacificwide] Check your buying power.',
        template: './ppe_share_me_affordability',
        context: {
          customerName: (!data.firstName && !data.lastName) ? data.email : data.firstName + ' ' + data.lastName,
          annualIncome: dollarFormat(data.annualIncome),
          monthlyDebt: dollarFormat(data.monthlyDebt),
          DTI: data.DTI + '%',
          downPayment: dollarFormat(data.downPayment),
          zipcode: data.zipcode ? data.zipcode : '',
          loanTerm: data.loanTerm,
          rate: data.interestRate + '%',
          hoa: dollarFormat(data.hoa),
          otherFees: dollarFormat(data.otherFees),
          homeInsurance: dollarFormat(data.homeInsurance),
          propertyTaxPercent: data.propertyTaxPercent + '%',
          pmiPercentaged: data.pmiPercentage + '%',
          queryString: data.queryString,
          domain: process.env.FE_DOMAIN,
          estPropertyValue: dollarFormat(data.estPropertyValue),
        },
      });
    } catch (err) {
      console.log(err, 'err');
      // return false;
    }
  }

  async sendMailNotifyMe(
    email: string,
    data: {
      targetRate: any,
      targetPoint: any,
      targetMonthlyPayment: any,
      firstName: any;
      lastName: any;
      dataRate: {
        rate: any;
        apr: any;
        investor: any;
        credit: any;
        point: any;
        closingCost: any;
        payment: any;
        lastUpdate: any;
        price: any;
        principalAndInterest: any;
      }[];
      propertyAmount: any;
      occupancy: string;
      propertyType: string;
      zipCode: any;
      creditScore: any;
      searchId: string;
      time: Date;
      loanPurpose: string;
      loanAmount: any;
      loanTerm: string;
    },
    querySearch,
    alertFrequency = 3
  ) {

    /* eslint-disable */

    const querystring = require('node:querystring');

    const linkEditTracking = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      editTracking: true,
    });

    const linkUnsubscribe = querystring.stringify({
      ...querySearch,
      searchId: data.searchId,
      unsubscribe: true,
    });

    let dataRate = data.dataRate.map((each) => {
      each['check'] = Number(each.credit) >= 0 ? true : false;
      each.credit = dollarFormat(each.credit);
      each.price = dollarFormat(each.price);
      each.principalAndInterest = dollarFormat(each.principalAndInterest);
      each.payment = dollarFormat(each.payment);
      each.closingCost = dollarFormat(each.closingCost);
      return each;
    });

    if (alertFrequency === 1) {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Rate alert: Market rates have hit your target.',
        template: './ppe_rate_tracking_noti_below_target',
        context: {
          targetRate: data.targetRate,
          targetPoint: dollarFormat(data.targetPoint),
          targetMonthlyPayment: dollarFormat(data.targetMonthlyPayment),
          customerName: (!data.firstName && !data.lastName) ? email : data.firstName + ' ' + data.lastName,
          loanAmount: dollarFormat(data.loanAmount),
          loanTerm: data.loanTerm,
          propertyAmount: dollarFormat(data.propertyAmount),
          occupancy: data.occupancy,
          propertyType: data.propertyType,
          zipCode: data.zipCode,
          creditScore: data.creditScore,
          loanPurpose: data.loanPurpose,
          dataRate: dataRate,
          linkEditTracking: process.env.FE_DOMAIN + '/customized-rate?' + linkEditTracking,
          linkUnsubscribe: process.env.FE_DOMAIN + '/customized-rate?' + linkUnsubscribe,
          time: data.time,
          domain: process.env.FE_DOMAIN,
        },
      });
    } else {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Rate alert: Market rates have hit your target.',
        template: 'ppe_rate_tracking_noti_every_time',
        context: {
          customerName: (!data.firstName && !data.lastName) ? email : data.firstName + ' ' + data.lastName,
          loanAmount: dollarFormat(data.loanAmount),
          loanTerm: data.loanTerm,
          propertyAmount: dollarFormat(data.propertyAmount),
          occupancy: data.occupancy,
          propertyType: data.propertyType,
          zipCode: data.zipCode,
          creditScore: data.creditScore,
          loanPurpose: data.loanPurpose,
          dataRate: dataRate,
          linkEditTracking: process.env.FE_DOMAIN + '/customized-rate?' + linkEditTracking,
          linkUnsubscribe: process.env.FE_DOMAIN + '/customized-rate?' + linkUnsubscribe,
          time: data.time,
          domain: process.env.FE_DOMAIN,
        },
      });
    }
    // try {

    // } catch (err) {
    //   console.log(err, 'err');
    //   // return false;
    // }
  }
  async sendVerifyAdminEmail(email: string, customerName: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Verify your email',
        template: './verify_login_admin',
        context: {
          customerName: customerName ? customerName : email,
          otp,
          domain: process.env.FE_DOMAIN,
          timeExpired: parseInt(process.env.TIME_EXPIRED_OTP_EMAIL_SIGNUP) / 60
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendChangePasswordSuccessEmail(email, customerName) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Password Successfully Changed ',
        template: './change_password_success',
        context: {
          customerName: customerName ? customerName : email,
          domain: process.env.FE_DOMAIN,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendOtpVerifyEmailForgot(email: string, customerName: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Email account forgot password ' + email,
        template: './forgot_password',
        context: {
          customerName: customerName ? customerName : email,
          domain: process.env.FE_DOMAIN,
          linkResetPassword: `${process.env.FE_DOMAIN_ADMIN_PORTAL}/reset-password?code=${otp}`,
          timeExpired: parseInt(process.env.TIME_EXPIRED_OTP_EMAIL_FORGOT) / 3600
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendInvitationEmail(email: string, customerName: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] Invite user ' + email + ' to ',
        template: './invite_user',
        context: {
          customerName: customerName ? customerName : email,
          domain: process.env.FE_DOMAIN_ADMIN_PORTAL,
          email,
          password,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }


  async sendMailCustomerAddReview(
    email: string,
    customerName: string,
    star: number, comment: string, link: string
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '[Pacificwide] New User Feedback Received',
        template: './feedback_to_agency_new',
        context: {
          customerName: customerName ? customerName : email,
          domain: process.env.FE_DOMAIN,
          star: star,
          comment: comment,
          link: process.env.FE_DOMAIN_ADMIN_PORTAL + link,
        },
      });
    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }

  async sendMailPreQualification(data: { type: string, email: string, agentName: string, leadName: string, fileName: string, filePath: string }
  ) {
    const { type, email, agentName, leadName, fileName, filePath } = data;
    try {

      await this.mailerService.sendMail({
        to: email,
        subject: type === 'purchase' ? '[Pacificwide] New User Completed Purchase Application' : '[Pacificwide] New User Completed Purchase Application',
        template: type === 'purchase' ? './notify-pre-qualification-purchase-submit-to-agency' : './notify-pre-qualification-refinance-submit-to-agency',
        context: {
          agentName,
          leadName,
          domain: process.env.FE_DOMAIN,
        },
        attachments: [
          {
            filename: fileName,
            contentType: 'application/pdf',
            // content: new Buffer(invoicePdf, 'base64'),
            path: filePath
          },
        ]
      });

    } catch (err) {
      console.log(err, 'err');
      return false;
    }
  }
}
