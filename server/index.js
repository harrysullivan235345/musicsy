const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const mongoose = require('mongoose');
var sslRedirect = require('heroku-ssl-redirect');
const session = require('express-session');

var passportConfig = require('./config/passport');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');

const keys = require('./config/keys');
var socket = require('./socket');
const api_router = require('./routes/api');

const ffmpeg = require('fluent-ffmpeg');

var fs = require('fs');
var dir = './server/storage';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    app.use(sslRedirect());
  }

  app.use(session({
    secret: keys.session.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000
    }
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(fileUpload());

  app.use(passport.initialize());
  app.use(passport.session());


  mongoose.connect(keys.mongodb.db_url, { useNewUrlParser: true }, () => {
    console.log('Connected to mongodb');
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  var server = app.listen(port, host)
  socket.init(server);

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
