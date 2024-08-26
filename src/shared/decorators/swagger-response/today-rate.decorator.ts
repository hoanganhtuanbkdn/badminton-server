import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class OpenApiTodayRateSuccessResponse {
  @ApiProperty({
    example: {
      dataConvert: [
        {
          "label": "15-Year Fixed*",
          "tip": "The conventional 15-year fixed mortgage presents the security of a locked-in, comparatively lower monthly payment for its shorter term.",
          "requiment": [
            "Minimum 640 Credit Score",
            "10% Down Payment",
            "2% - 5% In Closing Costs",
            "Debt-To-Income Ratio ≤ 43%"
          ],
          "urlRedirect": "/loan-options/15-year-fixed",
          "urlCustomizeRate": "/customized-rate?loanProgram=FifteenYear&loanType=Conventional",
          "changeLastMonth": {
            "interest_rate": 1.038,
            "apr": 1.2066
          },
          "changeYesterday": {
            "interest_rate": 0.0274,
            "apr": 0.0289
          },
          "rate": 6.913,
          "apr": 7.1806,
          "payment": 4471.9718,
          "credit": 1363.8636,
          "name": "15-Year Fixed*"
        },
        {
          "label": "25-Year Fixed*",
          "tip": "The conventional 25-year fixed mortgage provides the calmness of a guaranteed, relatively lower monthly payment over its span.",
          "requiment": [
            "Minimum 630 Credit Score",
            "5% Down Payment",
            "2% - 5% In Closing Costs",
            "Debt-To-Income Ratio ≤ 43%"
          ],
          "urlRedirect": "/loan-options/25-year-fixed",
          "urlCustomizeRate": "/customized-rate?loanProgram=TwentyFiveYear&loanType=Conventional",
          "changeLastMonth": {
            "interest_rate": 0.8193,
            "apr": 0.8822
          },
          "changeYesterday": {
            "interest_rate": 0,
            "apr": -0.0004
          },
          "rate": 7.1944,
          "apr": 7.3372,
          "payment": 3604.1256,
          "credit": -129.4444,
          "name": "25-Year Fixed*"
        },
        {
          "label": "30-Year Fixed*",
          "tip": "The conventional 30-year fixed mortgage provides the reassurance of a stable, reduced monthly mortgage payment.",
          "requiment": [
            "Minimum 620 Credit Score",
            "3% Down Payment",
            "2% – 6% In Closing Costs",
            "Debt-To-Income Ratio ≤ 50%"
          ],
          "urlRedirect": "/loan-options/30-year-fixed",
          "urlCustomizeRate": "/customized-rate?loanProgram=ThirtyYear&loanType=Conventional",
          "changeLastMonth": {
            "interest_rate": 1.1109,
            "apr": 1.2052
          },
          "changeYesterday": {
            "interest_rate": -0.0518,
            "apr": -0.0534
          },
          "rate": 7.486,
          "apr": 7.6512,
          "payment": 3495.8826,
          "credit": -184.5652,
          "name": "30-Year Fixed*"
        },
        {
          "label": "VA 30-Year Fixed*",
          "tip": "The VA 30-year fixed mortgage offers the tranquility that comes with a secured, lower monthly mortgage payment, beneficial for our veterans and service members.",
          "requiment": [
            "No Minimum Credit Score",
            "No Down Payment Required",
            "1% - 3% In Closing Costs",
            "Debt-To-Income Ratio ≤ 41%"
          ],
          "urlRedirect": "/loan-options/va-loan",
          "urlCustomizeRate": "/customized-rate?loanProgram=ThirtyYear&loanType=VA",
          "changeLastMonth": {
            "interest_rate": 0.75,
            "apr": 0.806
          },
          "changeYesterday": {
            "interest_rate": 0,
            "apr": 0
          },
          "rate": 6.125,
          "apr": 6.246,
          "payment": 1822.83,
          "credit": -675.75,
          "name": "VA 30-Year Fixed*"
        },
        {
          "label": "FHA 30-Year Fixed*",
          "tip": "The FHA 30-year fixed mortgage presents the relief of a locked-in, lower monthly mortgage payment, ideal for first-time homeowners.",
          "requiment": [
            "Minimum 580 Credit Score",
            "3.5% Down Payment",
            "2% - 5% In Closing Costs",
            "Debt-To-Income Ratio ≤ 43%"
          ],
          "urlRedirect": "/loan-options/fha",
          "urlCustomizeRate": "/customized-rate?loanProgram=ThirtyYear&loanType=FHA",
          "changeLastMonth": {
            "interest_rate": 0.8182,
            "apr": 0.8891
          },
          "changeYesterday": {
            "interest_rate": -0.0340,
            "apr": -0.0348
          },
          "rate": 6.1932,
          "apr": 6.8401,
          "payment": 1992.9682,
          "credit": -511.4325,
          "name": "FHA 30-Year Fixed*"
        },
        {
          "label": "USDA 30-Year Fixed*",
          "tip": "The USDA 30-year fixed mortgage presents the relief of a locked-in, lower monthly mortgage payment, ideal for first-time homeowners.",
          "requiment": [
            "Minimum 640 Credit Score",
            "No Down Payment Required",
            "1% - 3% In Closing Costs",
            "Debt-To-Income Ratio ≤ 41%"
          ],
          "urlRedirect": "/loan-options/usda-loan",
          "urlCustomizeRate": "/customized-rate?loanProgram=ThirtyYear&loanType=USDARuralHousing",
          "changeLastMonth": {
            "interest_rate": 0.625,
            "apr": 0.6430
          },
          "changeYesterday": {
            "interest_rate": -0.0625,
            "apr": -0.0629
          },
          "rate": 6.125,
          "apr": 6.647,
          "payment": 3215.25,
          "credit": -373.737,
          "name": "USDA 30-Year Fixed*"
        }
      ]
    },
  })
  data?: object;

  @ApiProperty({ example: 1000 })
  resultCode: number;
  @ApiProperty({ example: 'SUCCESS' })
  status: string;
  @ApiProperty({ example: null })
  errorMessage: object;
}
export const OpenApiTodayRate = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get today rate data',
    }),
    ApiOkResponse({
      description: 'The api is successfully created',
      type: OpenApiTodayRateSuccessResponse,
    }),
  );
};
