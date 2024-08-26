import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class OpenApiQueryRateSuccessResponse {
  @ApiProperty({
    example: {
      searchId: '231f682b-408d-447a-bfc6-5134ef120fc8',
      dataConvert: [
        {
          rate: 8.25,
          apr: 8.451,
          investor: "JMAC Lending, Inc. - Correspondent - ",
          credit: 0,
          point: 0,
          closingCost: 14785,
          payment: 6010.13,
          lastUpdate: "2024-01-22T16:30:46.03Z",
          price: 100,
          principalAndInterest: 6010.13
        },
      ],
      dataRaw: {
        products: [
          {
            bonaFideDiscountPoints: 0,
            qmStatus: "Fail",
            apr: 7.884,
            productType: "StandardProducts",
            armMargin: 0,
            closingCost: 19744,
            lastUpdate: "2024-01-22T20:19:46.013Z",
            loanTerm: "ThirtyYear",
            lockPeriod: 30,
            price: 98.009,
            rate: 7.625,
            rebate: 0,
            discount: 15928,
            principalAndInterest: 5662.35,
            monthlyMI: 0,
            totalPayment: 5662.35,
            loCompensationDollars: 0,
            loCompensationPercent: 0,
            highBalance: "Yes",
            amortizationTerm: "ThirtyYear",
            amortizationType: "Fixed",
            investorId: 121024,
            investor: "Newfi - Wholesale - ",
            loanType: "Conforming",
            priceStatus: "Expired",
            pendingUpdate: false,
            productId: 47990022,
            productName: "Newfi - Wholesale -  FNMA Conforming High Balance 30 Year Fixed ",
            guidelines: [
              {
                documentDescription: "Fannie Mae Manufactured Housing Product Matrix",
                guidelineLink: {
                  rel: "self",
                  href: "https://marketplace.optimalblue.com/full/api/guideline?isIndex=False&value=3499_08282023_1504555065.pdf",
                  action: "GET",
                  fileExtension: "pdf",
                  types: [
                    "application/pdf"
                  ]
                }
              }
            ]
          }
        ],
        totalLoanAmountDetails: {
          totalLoanAmount: 800000,
        },
        cltv: 0,
        ltv: 80,
        hcltv: 0,
        amiPercentage: 0,
        searchId: "447266563E1705995054",
        searchTime: '2023-11-17T06:24:19.8901113Z',
        customerInternalId: 'OBSearch',
        additionalFields: {},
        messages: []
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
export const OpenApiQueryRate = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get mortgage rate with filter query',
    }),
    ApiOkResponse({
      description: 'The api is successfully created',
      type: OpenApiQueryRateSuccessResponse,
    }),
  );
};
