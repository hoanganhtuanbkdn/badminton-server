import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class OpenApiGetAllRateSuccessResponse {
  @ApiProperty({
    example: {
      resultCode: 1000,
      status: 'SUCCESSFUL',
      errorMessage: null,
      data: {
        dataPurchase: [
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
          },
        ],
        dataRefinance: [
          {
            rate: 9.25,
            apr: 9.36,
            investor: 'Newfi - Wholesale - ',
            credit: -228,
            point: '-0.0380',
            closingCost: 3816,
            payment: 6175.15,
            lastUpdate: '2023-11-16T23:46:20Z',
            price: 100.038,
            principalAndInterest: 6175,
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
              interest_rate: -0.375,
              apr: -0.3830000000000009,
            },
          },
        ],
      },
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
export const OpenApiGetAllRate = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all mortgage rate by type purchase and refinance',
    }),
    ApiOkResponse({
      description: 'The api is successfully created',
      type: OpenApiGetAllRateSuccessResponse,
    }),
  );
};
