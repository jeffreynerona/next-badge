'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;
var io = require('socket.io')();

var RateLimit = require('express-rate-limit');

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// middleware
// limiter
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 

var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes 
  max: 1000, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

//  apply to all requests 
app.use(limiter);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// parese application/json
app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));
// passport config
app.use(_passport2.default.initialize());
var User = require('./model/user');

_passport2.default.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, next) {
  User.findOne({ email: email }, function (err, user) {

    if (err) {
      return next(err);
    }
    if (!user) {
      return next('Incorrect Email or Password');
    }

    if (!user.validPassword(password)) {
      return next('Incorrect Email or Password');
    }

    return next(null, user);
  });
}));

_passport2.default.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, next) {
  console.log(email + " " + password);
  process.nextTick(function () {

    User.findOne({ email: email }, function (err, user) {
      console.log(user);
      if (err) {
        console.log("stops at err");
        next(err);
      }
      if (user) {
        console.log("stops at err");
        next('Email is already used.');
      }

      var newUser = new User();
      newUser.email = email;
      newUser.fullname = req.body.fullname;
      newUser.password = newUser.generateHash(password);
      newUser.type = "user";
      newUser.coins = 0;
      newUser.username = email;
      newUser.save(function (err) {
        if (err) {
          console.log("err after creation");
          console.log(err);
          next(err);
        }
        console.log(newUser);
        next(null, newUser);
      });
    });
  });
}));

_passport2.default.serializeUser(function (user, done) {
  done(null, user.id);
});
_passport2.default.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// api routes v1
app.use('/v1', _routes2.default);

//socket stuff
io.on('connection', function (client) {
  var qrgenerator;
  client.on('hostEvent', function (event) {
    console.log(client.id + '-Hosting ' + event.eventid + '. Interval: ' + event.interval + ' seconds');
    var x = 0;
    qrgenerator = setInterval(function () {
      x += 1;
      client.emit('qrcode', x);
    }, event.interval);
  });
  client.on('disconnect', function () {
    console.log(client.id + ' has disconnected');
    clearInterval(qrgenerator);
  });
});

var port = 8000;
io.listen(port);
console.log('Magic is happening at port:', port);

app.server.listen(_config2.default.port);
console.log('started the magic on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map