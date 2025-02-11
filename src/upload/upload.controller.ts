import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BedrockService } from '../bedrock/bedrock.service';

@Controller('analyze')
export class UploadController {
  constructor(private readonly bedrockService: BedrockService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    // ✅ 파일을 Base64로 변환
    const imageBase64 = file.buffer.toString('base64');

    // ✅ AWS Bedrock API 호출
    const analysisResult = await this.bedrockService.analyzeImage(imageBase64);

    return {
      fileName: file.originalname,
      analysisResult: JSON.parse(analysisResult),
    };
  }
}
