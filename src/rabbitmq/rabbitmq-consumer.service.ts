import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqConsumerService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.listen();
  }

  private async listen() {
    try {
      const rabbitMqUrl = this.configService.get<string>('rabbitmq.server');
      const routingKey = this.configService.get<string>(
        'rabbitmq.routing.validateJson',
      );
      const topicRoutingKey = this.configService.get<string>(
        'rabbitmq.routing.topicValidateJson',
      );

      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();

      this.logger.log('Consumer connected successfully');

      await this.channel.assertExchange(routingKey, 'direct', {
        durable: true,
        autoDelete: false,
      });

      // Assert the queue we want to consume from
      await this.channel.assertQueue(topicRoutingKey, {
        durable: true,
        autoDelete: false,
        exclusive: false,
      });

      // Bind queue to exchange if needed
      await this.channel.bindQueue(topicRoutingKey, routingKey, topicRoutingKey);

      this.channel.consume(
        topicRoutingKey,
        (message) => {
          if (message) {
            const content = message.content.toString();
            this.logger.log(`Received message: ${content}`);
            // Process the message here
          }
        },
        { noAck: true },
      );

      this.connection.on('error', (err) => {
        this.logger.error(`Connection error: ${err.message}`);
        this.reconnect();
      });

      this.connection.on('close', () => {
        this.logger.warn('Connection closed, reconnecting...');
        this.reconnect();
      });
    } catch (error) {
      this.logger.error(`Error in listen: ${(error as Error).message}`);
      setTimeout(() => this.listen(), 5000);
    }
  }

  private async reconnect() {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (err) {
        // Connection already closed
      }
    }
    setTimeout(() => this.listen(), 5000);
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
