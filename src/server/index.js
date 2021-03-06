const express       = require('express');
const app           = express();
const apiRouter     = require('./routers/apiRouter.js');
const staticRouter  = require('./routers/staticRouter.js');
const port          = process.env.PORT || 3000;
const passport      = require('passport');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');
const RedisStore    = require('connect-redis')(session);
const bluebird      = require('bluebird');
const redis         = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient   = redis.createClient(6379, process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost');
const bodyParser    = require('body-parser');
const server        = require('http').Server(app);
const io            = require('socket.io')(server);
require('./config/socketio.js')(io, redisClient);

console.log("Current callback IP address set to:", process.env.CALLBACKURL || 'http://localhost:2000/api/auth/github/callback');

app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  saveUninitialized: false,
  resave: true,
  store: new RedisStore({ host: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost', port: 6379 }),
}));

require('./config/passport.js')(passport, redisClient);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(`${__dirname}/../../dist/client`));
app.set('views', `${__dirname}/../../dist/client`);

apiRouter(app, passport, redisClient);
staticRouter(app, redisClient);

io.on('connect', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});


server.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log(`listening to port: ${port}`);
});

module.exports = app;

