import { Module } from '@nestjs/common';
import { RabbitmqProducerService } from './rabbitmq-producer.service';
import { RabbitmqConsumerService } from './rabbitmq-consumer.service';

@Module({
  providers: [RabbitmqProducerService, RabbitmqConsumerService],
  exports: [RabbitmqProducerService, RabbitmqConsumerService],
})
export class RabbitmqModule {}
