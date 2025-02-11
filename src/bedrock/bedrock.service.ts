import { Injectable, BadRequestException } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BedrockService {
  private readonly client: BedrockRuntimeClient;
  private readonly modelId: string;
  constructor() {
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_BEDROCK_MODEL_ID
    ) {
      throw new Error('AWS 환경 변수가 설정되지 않았습니다.');
    }

    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    this.modelId = process.env.AWS_BEDROCK_MODEL_ID as string;
  }

  // ✅ AWS Bedrock을 이용한 이미지 분석 요청
  async analyzeImage(imageBase64: string): Promise<any> {
    const params = {
      modelId: this.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64, // ✅ Base64로 변환한 이미지 데이터
                },
              },
              {
                type: 'text',
                text: "이 사진에서 상품 구매 날짜와, 상품명, 가격을 추출해 이 4개의 항목이 하나의 아이템이 되는 형태로 추출해주세요. 항목의 이름은 date, itemName, category, amount로 해주세요. 만약 인식할 수 없는 항목이 있다면 빈칸으로 해주세요. 카테고리도 '기저귀(물티슈), 생활(위생용품), 수유(이유용품), 스킨케어(화장품), 식품, 완구용품, 침구류, 패션의류(잡화), 기타'중 하나로 골라주세요. 이것들을 json타입으로 정리해서 답변해주세요. json외에 다른 말은 하지 말아주세요.",
              },
            ],
          },
        ],
      }),
    };

    console.log('📤 Sending request to AWS Bedrock:', params);

    const command = new InvokeModelCommand(params);
    const response = await this.client.send(command);
    // console.log('json', JSON.parse(new TextDecoder().decode(response.body)));
    // console.log(
    //   'response',
    //   JSON.parse(new TextDecoder().decode(response.body)).content,
    // );
    console.log(
      'result',
      JSON.parse(new TextDecoder().decode(response.body)).content[0].text,
    );
    return JSON.parse(new TextDecoder().decode(response.body)).content[0].text;
  }
}
