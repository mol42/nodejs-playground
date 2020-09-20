const amqp = require("amqplib/callback_api");

const AMPQ_GLOBAL = {
  connection: null
};

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    //
    console.log(error0);
  }
  AMPQ_GLOBAL.connection = connection;
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

const messageQueueClient = (function () {
  const callRPCQueue = async function (queueName, data) {
    //---
    return new Promise((resolve, reject) => {
      //----
      AMPQ_GLOBAL.connection.createChannel(function (error1, channel) {
        if (error1) {
          reject(error1);
        }
        //----
        channel.assertQueue(
          "",
          {
            exclusive: true
          },
          function (error2, q) {
            if (error2) {
              reject(error2);
              return;
            }
            const correlationId = generateUuid();

            console.log(" [x] Requesting correlationId", correlationId);

            channel.consume(
              q.queue,
              function (msg) {
                if (msg.properties.correlationId === correlationId) {
                  console.log(" [.] Got %s", msg.content.toString());
                  resolve(msg.content.toString());
                }
              },
              {
                noAck: true
              }
            );

            channel.sendToQueue(queueName, Buffer.from(data), {
              correlationId: correlationId,
              replyTo: q.queue
            });
          }
        );
      });
    });
  };

  return {
    callRPCQueue
  };
})();

module.exports = messageQueueClient;
