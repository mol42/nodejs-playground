// initialize dotenv
require("dotenv").config();

const amqp = require("amqplib/callback_api");
const jwt = require("jsonwebtoken");

const jwtKey = "code42_secret_key";
const jwtExpirySeconds = 300;

const users = {
  user1: "pass1",
  user2: "pass2"
};

const auth_doLogin = async function (data) {
  try {
    const { username, password } = data;
    if (!username || !password || users[username] !== password) {
      return JSON.stringify({ error: "ERROR_401" });
    }

    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    const token = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    });
    console.log("token:", token);

    return JSON.stringify({
      jwtToken: token
    });
  } catch (err) {
    console.log(err);
    return JSON.stringify({ error: "error" });
  }
};

/*
 **********************************************************************
 */

amqp.connect(`amqp://localhost?heartbeat=10`, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "code42_auth_queue";

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests");
    channel.consume(queue, async function reply(msg) {
      //-----
      const commandDataJSON = msg.content.toString();
      console.log("incoming command", commandDataJSON);
      const commandData = JSON.parse(commandDataJSON);
      const responseAsJSONString = { data: null };
      const { command, data } = commandData;
      //------
      if (command === "DO_LOGIN") {
        responseAsJSONString.data = await auth_doLogin(data);
      }
      //------
      if (responseAsJSONString.data !== null) {
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(responseAsJSONString.data), {
          correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
      } else {
        channel.ack(msg);
      }
    });
  });
});
