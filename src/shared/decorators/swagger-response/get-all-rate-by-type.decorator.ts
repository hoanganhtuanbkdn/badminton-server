import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class OpenApiGetAllRateByTypeSuccessResponse {
  @ApiProperty({
    example: {
      dataConvert: [
        {
          rate: 6.75,
          apr: 6.852,
          investor: 'Newrez, LLC - Wholesale - ',
          credit: -198,
          point: '-0.0330',
          closingCost: 3816,
          payment: 5309.46,
          lastUpdate: '2023-11-16T15:31:48Z',
          price: 100.033,
          principalAndInterest: 5309,
          label: '15-Year Fixed*',
          tip: 'The conventional 15-year fixed mortgage presents the security of a locked-in, comparatively lower monthly payment for its shorter term.',
          requiment: [
            'Minimum 640 Credit Score',
            '10% Down Payment',
            '2% - 5% In Closing Costs',
            'Debt-To-Income Ratio ≤ 43%',
          ],
          urlRedirect: '/loan/15-year-fixed',
          urlCustomizeRate: '/customized-rate?loanProgram=FifteenYear&loanType=Conventional',
          changeLastMonth: {
            interest_rate: -2.375,
            apr: -2.3889999999999993,
          },
          name: '15-Year Fixed*',
        },
        {
          rate: 7.125,
          apr: 7.196,
          investor: 'Newrez, LLC - Wholesale - ',
          credit: -66,
          point: '-0.0110',
          closingCost: 3816,
          payment: 4288.64,
          lastUpdate: '2023-11-16T15:31:48Z',
          price: 100.011,
          principalAndInterest: 4289,
          label: '25-Year Fixed*',
          tip: 'The conventional 25-year fixed mortgage provides the calmness of a guaranteed, relatively lower monthly payment over its span.',
          requiment: [
            'Minimum 630 Credit Score',
            '5% Down Payment',
            '2% - 5% In Closing Costs',
            'Debt-To-Income Ratio ≤ 43%',
          ],
          urlRedirect: '/loan/25-year-fixed',
          urlCustomizeRate: '/customized-rate?loanProgram=TwentyFiveYear&loanType=Conventional',
          changeLastMonth: {
            interest_rate: -0.75,
            apr: -0.7530000000000001,
          },
          name: '25-Year Fixed*',
        },
        {
          rate: 7.125,
          apr: 7.189,
          investor: 'Newrez, LLC - Wholesale - ',
          credit: -66,
          point: '-0.0110',
          closingCost: 3816,
          payment: 4042.31,
          lastUpdate: '2023-11-16T15:31:48Z',
          price: 100.011,
          principalAndInterest: 4042,
          label: '30-Year Fixed*',
          tip: 'The conventional 30-year fixed mortgage provides the reassurance of a stable, reduced monthly mortgage payment.',
          requiment: [
            'Minimum 620 Credit Score',
            '3% Down Payment',
            '2% – 6% In Closing Costs',
            'Debt-To-Income Ratio ≤ 50%',
          ],
          urlRedirect: '/loan/30-year-fixed',
          urlCustomizeRate: '/customized-rate?loanProgram=ThirtyYear&loanType=Conventional',
          changeLastMonth: {
            interest_rate: -0.75,
            apr: -0.7530000000000001,
          },
          name: '30-Year Fixed*',
        },
      ],
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
export const OpenApiGetAllRateByType = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all mortgage rate by yype purchase or refinance',
    }),
    ApiOkResponse({
      description: 'The api is successfully created',
      type: OpenApiGetAllRateByTypeSuccessResponse,
    }),
  );
};
