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

    /*
    JWT tokenlari suna benzer yapidadir : 
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNjAxMTc4NzI2LCJleHAiOjE2MDExNzkwMjZ9.gR5hPrZ3frV1MgC5YdwomlLxMmNxa3RoWqqxDt5F5wM

    1. kisim : header kismidir, 3.parcanin hangi algoritma ile turetildigi bilgisini tutar
    2. kisim : payload kismi yani jwtToken icinde tasimak istedigimiz verileri sakladigimiz kisim
                base64 ile encode edildigi icin session ile ilgili bilgiler haricinde bilgi tasimayin !
                ornek : kisinin adresi bilgisi burada olmasin
    3. kisim : JWT algoritmasi ile turetilmis key kismi, bu kisim secret key yardimi ile olusturuldugu icin
                secret key olmadan kimse ayni key'i turetemez ve bu bize jwtToken'in sadece islem yapan
                kisi icin ozel oldugunu garanti eder. Daha guvenli olmasi icin 1 kac essiz veri kullanabilirsiniz

    1 ve 2. kisim datalarini "echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 | base64 -D" seklinde gorebiliriz istersek
    */
    const jwtToken = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    });

    console.log("token:", jwtToken);

    return JSON.stringify({
      jwtToken
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
