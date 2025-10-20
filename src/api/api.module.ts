import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [ApiController],
})
export class ApiModule {}
