// initialize dotenv
require("dotenv").config();

const amqp = require("amqplib/callback_api");
const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");

const jwtKey = "code42_secret_key";
const jwtExpirySeconds = 90;

const users = {
  user1: "pass1",
  user2: "pass2"
};

const customRefreshTokens = {};

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
    // custom urettigimiz refresh tokeni in-memory bir objeye sakliyoruz bu ornekte
    // siz redis, mysql vb uygun bir yerde saklayabilirsiniz.
    const refreshToken = randtoken.uid(256);
    customRefreshTokens[refreshToken] = username;

    return JSON.stringify({
      jwtToken,
      refreshToken
    });
  } catch (err) {
    console.log(err);
    return JSON.stringify({ error: "ERROR_99999" });
  }
};

// Bu endpoint login sirasinda uretilen jwtToken yardimi ile refresh token
// islemi yapmaktadir. Alternatif yontem custom urettigimiz refresh tokendir
// ve ornegi asagidadir.
//
// her request sonucunda token refresh etmek ya da expirySecond
// bitmeden uygulamanizda arka planda refresh cagrisi yapmak iyi
// bir fikirdir.
const auth_refresh = async function (data) {
  const { jwtToken } = data;

  if (!jwtToken) {
    return JSON.stringify({ error: "ERROR_401" });
  }

  let payload;
  try {
    payload = jwt.verify(jwtToken, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return JSON.stringify({ error: "ERROR_401" });
    }
    return JSON.stringify({ error: "ERROR_400" });
  }
  try {
    // login sirasindaki uretilen token ile ayni mantik ile token uretiyoruz
    // tek farki su anda urettigimiz icin jwtExpirySeconds ile birlestiginde
    // jwtExpirySeconds kadar sure valid olacak bu token yani bir nevi
    // token'in suresini uzatmis olduk yeni baska bir token ile.
    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    });

    return JSON.stringify({
      jwtToken: newToken
    });
  } catch (err) {
    return JSON.stringify({ error: "ERROR_99999" });
  }
};

// Bu endpoint login sirasinda random bir generator ile urettigimiz refresh token yardimi ile
// token refresh islemidir, custom token bilgisini server tarafinda redis/mysql vb
// bir ortamda saklayabiliriz
const auth_refreshWithCustomRefreshToken = async function (data) {
  const { username, customRefreshToken } = data;

  if (customRefreshToken in customRefreshTokens && customRefreshTokens[customRefreshToken] === username) {
    const newToken = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    });
    // Bu noktada yeni bir refresh token uretip donebilirsiniz daha da guvenli bir yapi olusmasi
    // adina..
    return JSON.stringify({
      jwtToken: newToken
    });
  } else {
    return JSON.stringify({ error: "ERROR_401" });
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
      } else if (command === "DO_REFRESH") {
        responseAsJSONString.data = await auth_refresh(data);
      } else if (command === "DO_REFRESH_WITH_CUSTOM_TOKEN") {
        responseAsJSONString.data = await auth_refreshWithCustomRefreshToken(data);
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
