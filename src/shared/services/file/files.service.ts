import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string, mimetype: string): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ContentType: mimetype,
      })
      .promise();

    return uploadResult;
  }

  async uploadFileBig() {
    // const AWS = require('aws-sdk');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');

    // AWS.config.update({ accessKeyId: 'YOUR_ACCESS_KEY', secretAccessKey: 'YOUR_SECRET_KEY' });

    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });

    const params = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: 'file_example_MP4_480_1_5MG.mp4', // Tên tệp tin trên S3
      Body: fs.createReadStream('/home/minh/Downloads/file_example_MP4_480_1_5MG.mp4'), // Đường dẫn đến video cần upload
    };

    s3.createMultipartUpload(params, (err, multipart) => {
      if (err) {
        console.error('Error creating multipart upload:', err);
        return;
      }

      const parts = [];
      const partNumber = 1;

      const uploadPart = (partNumber) => {
        const readStream = fs.createReadStream('path-to-part-' + partNumber + '.mp4'); // Đọc từng phần của video
        const partParams = {
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Key: 'video.mp4',
          UploadId: multipart.UploadId,
          PartNumber: partNumber,
          Body: readStream,
        };

        s3.uploadPart(partParams, (err, data) => {
          if (err) {
            console.error('Error uploading part', partNumber, err);
            return;
          }

          console.log('Uploaded part', partNumber);
          parts.push({ ETag: data.ETag, PartNumber: partNumber });

          if (partNumber < totalParts) {
            partNumber++;
            uploadPart(partNumber);
          } else {
            completeMultipartUpload();
          }
        });
      };

      const totalParts = Math.ceil(params.Body.size / (2 * 1024 * 1024)); // Chia video thành các phần 5 MB (có thể điều chỉnh)

      uploadPart(partNumber);

      const completeMultipartUpload = () => {
        s3.completeMultipartUpload(
          {
            Bucket: 'your-bucket-name',
            Key: 'video.mp4',
            UploadId: multipart.UploadId,
            MultipartUpload: { Parts: parts },
          },
          (err, data) => {
            if (err) {
              console.error('Error completing multipart upload:', err);
            } else {
              console.log('Multipart upload completed:', data);
            }
          },
        );
      };
    });
  }

  async getPublicFile(
    res,
    payload: {
      key: string;
      // bucket: string;
    },
  ) {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });
    console.log(payload.key, 'payload');
    const params = {
      Key: payload.key,
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    };
    const stream = s3.getObject(params).createReadStream();

    // forward errors
    stream.on('error', function error(err) {
      console.log('err', err);

      //continue to the next middlewares
      // return next();
    });

    stream.on('end', () => {
      console.log('Served by Amazon S3: ' + params.Key);
    });
    stream.pipe(res);
  }
}
