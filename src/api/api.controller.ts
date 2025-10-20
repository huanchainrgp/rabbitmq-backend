import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RabbitmqProducerService } from '../rabbitmq/rabbitmq-producer.service';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);
  private count = 0;

  constructor(
    private readonly rabbitmqProducerService: RabbitmqProducerService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/')
  healthCheck() {
    return {
      code: 200,
      message: 'Service is healthy',
      data: {
        status: 'success',
        timestamp: new Date(),
      },
    };
  }

  @Post('save')
  @HttpCode(HttpStatus.OK)
  async save(@Body() body: any) {
    this.count++;
    this.logger.log(`Request received - ${this.count}`);

    try {
      const payload = {
        name: `api_c1 - ${this.count}`,
        timestamp: new Date(),
        metric: false,
      };

      const exchange = this.configService.get<string>(
        'rabbitmq.exchange.validateJson',
      );
      const routingKey = this.configService.get<string>(
        'rabbitmq.routing.topicValidateJson',
      );

      await this.rabbitmqProducerService.publish(exchange, routingKey, payload);

      return {
        code: 200,
        message: 'Data received',
        data: payload,
      };
    } catch (error) {
      this.logger.error(`Error processing request: ${(error as Error).message}`);
      return {
        code: 400,
        message: 'Bad request',
      };
    }
  }
}
