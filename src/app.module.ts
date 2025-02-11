import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { BedrockService } from './bedrock/bedrock.service';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService, BedrockService],
})
export class AppModule {}
