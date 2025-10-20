// const amqpUrl = "amqp://127.0.0.1:5672" // using docker
const amqpUrlCloud = "amqps://snqjmgsf:JY5-TbQ4EfyI3M9dQL2chdSTKQmqqzDc@possum.lmq.cloudamqp.com/snqjmgsf"
module.exports = {
  NODE_PORT: 4000,
  RBMQ: {
    SERVER: amqpUrlCloud,
    EXCHANGE: {
      C_VALIDATE_JSON: 'validateJSON',
      T_VALIDATE_JSON: 'topic_validateJSON'
    },
    ROUTING: {
      C_VALIDATE_JSON: 'validateJSON',
      T_VALIDATE_JSON: 'topic_validateJSON'
    },
    QUEUE: {
      T_VALIDATE_JSON: 'topic_validateJSON'
    }
  },
};
