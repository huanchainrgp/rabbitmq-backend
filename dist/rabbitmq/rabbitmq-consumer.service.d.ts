import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RabbitmqConsumerService implements OnModuleInit {
    private configService;
    private readonly logger;
    private connection;
    private channel;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private listen;
    private reconnect;
    onModuleDestroy(): Promise<void>;
}
