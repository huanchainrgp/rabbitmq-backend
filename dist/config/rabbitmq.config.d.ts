declare const _default: (() => {
    server: string;
    exchange: {
        validateJson: string;
        topicValidateJson: string;
    };
    routing: {
        validateJson: string;
        topicValidateJson: string;
    };
    queue: {
        topicValidateJson: string;
        backendnode: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    server: string;
    exchange: {
        validateJson: string;
        topicValidateJson: string;
    };
    routing: {
        validateJson: string;
        topicValidateJson: string;
    };
    queue: {
        topicValidateJson: string;
        backendnode: string;
    };
}>;
export default _default;
