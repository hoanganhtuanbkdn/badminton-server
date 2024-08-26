import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class OpenApiUploadImageSuccessResponse<T> {
  @ApiProperty({
    example:
      'https://pacificwide-profile-bucket.s3.us-west-1.amazonaws.com/81fc127d-c644-430e-bc2c-fba660542829-Screenshot%20from%202023-11-16%2011-45-46.png',
  })
  Location?: number;

  @ApiProperty({ example: 'cb1dde9086ba46297359d4aae44b27c8' })
  ETag?: string;

  @ApiProperty({ example: 'pacificwide-profile-bucket' })
  Bucket?: string;

  @ApiProperty({ example: '81fc127d-c644-430e-bc2c-fba660542829-Screenshot from 2023-11-16 11-45-46.png' })
  Key?: string;
}
export const OpenApiUploadImage = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload photos to S3',
    }),
    ApiOkResponse({
      description: 'The api is successfully created',
      type: OpenApiUploadImageSuccessResponse,
    }),
  );
};
