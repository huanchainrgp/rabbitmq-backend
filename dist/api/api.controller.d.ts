import { RabbitmqProducerService } from '../rabbitmq/rabbitmq-producer.service';
import { ConfigService } from '@nestjs/config';
export declare class ApiController {
    private readonly rabbitmqProducerService;
    private readonly configService;
    private readonly logger;
    private count;
    constructor(rabbitmqProducerService: RabbitmqProducerService, configService: ConfigService);
    healthCheck(): {
        code: number;
        message: string;
        data: {
            status: string;
            timestamp: Date;
        };
    };
    save(body: any): Promise<{
        code: number;
        message: string;
        data: {
            name: string;
            timestamp: Date;
            metric: boolean;
        };
    } | {
        code: number;
        message: string;
        data?: undefined;
    }>;
}
