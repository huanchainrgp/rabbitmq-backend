import { ConfigService } from '@nestjs/config';
export declare class RabbitmqProducerService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    publish(exchange: string, routingKey: string, payload: any): Promise<void>;
}
