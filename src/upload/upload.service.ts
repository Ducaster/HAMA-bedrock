import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

@Injectable()
export class UploadService {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor() {
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_S3_BUCKET_NAME
    ) {
      throw new Error('AWS 환경 변수가 설정되지 않았습니다.');
    }

    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  // ✅ 이미지 업로드
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileKey = `uploads/${uuidv4()}_${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }
}
