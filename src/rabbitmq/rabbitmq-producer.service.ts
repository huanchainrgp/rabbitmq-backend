import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqProducerService {
  private readonly logger = new Logger(RabbitmqProducerService.name);

  constructor(private configService: ConfigService) {}

  async publish(
    exchange: string,
    routingKey: string,
    payload: any,
  ): Promise<void> {
    try {
      const rabbitMqUrl = this.configService.get<string>('rabbitmq.server');
      const connection = await amqp.connect(rabbitMqUrl);
      const channel = await connection.createConfirmChannel();

      // If exchange is empty, we're publishing directly to a queue
      if (exchange === '') {
        // Assert the queue exists
        await channel.assertQueue(routingKey, {
          durable: true,
          autoDelete: false,
        });
        this.logger.log(`Publishing message directly to queue: ${routingKey}`);
      } else {
        // Using exchange routing
        await channel.assertExchange(exchange, 'direct', {
          durable: true,
          autoDelete: false,
        });
        this.logger.log(`Publishing message to exchange: ${exchange} with routing key: ${routingKey}`);
      }

      const messageBuffer = Buffer.from(JSON.stringify(payload));

      return new Promise((resolve, reject) => {
        channel.publish(
          exchange,
          routingKey,
          messageBuffer,
          { contentType: 'application/json', persistent: true },
          (err) => {
            if (err) {
              this.logger.error(`Failed to send message: ${err.message}`);
              reject(err);
            } else {
              this.logger.log('Message sent successfully');
              resolve();
            }
            connection.close();
          },
        );
      });
    } catch (error) {
      this.logger.error(`Error in publish: ${error.message}`);
      throw error;
    }
  }
}
