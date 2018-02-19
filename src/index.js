import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';
import Host from './model/host';

var RateLimit = require('express-rate-limit');

let app = express();
app.server = http.createServer(app);

// middleware
// limiter
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
 
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 1000, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
//  apply to all requests 
app.use(limiter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// parese application/json
app.use(bodyParser.json({
	limit: config.bodyLimit
}));
// passport config
app.use(passport.initialize());
let User = require('./model/user');

passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
	function(email, password, next) {
    User.findOne({email: email}, function(err, user){

      if (err) { return next(err); }
      if (!user) { return next('Incorrect Email or Password'); } 
      
      if (!user.validPassword(password)) {
      	return next('Incorrect Email or Password');
      }

      return next(null, user);
    });
  }
));

passport.use('local-register', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},
	function(req, email, password, next) {
		console.log(email +" "+ password)
		process.nextTick(function() {

	    User.findOne({email: email}, function(err, user){
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
	      newUser.email    = email;
	      newUser.fullname = req.body.fullname;
	      newUser.password = newUser.generateHash(password);
	      newUser.type = "user";
	      newUser.coins = 0;
	      newUser.username = email;
	      newUser.save(function(err) {
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
  }
));

passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

// api routes v1
app.use('/v1', routes);

//socket stuff
const io = require('socket.io')(app.server);
io.on('connection', (client) => {
  var qrgenerator;
  client.on('hostEvent', (event) => {
    console.log(client.id+'-Hosting '+event.eventid+'. Interval: '+event.interval+' seconds');
    var qrdetails;
    qrgenerator = setInterval(() => {
    Host.find({
      "event" : event.eventid,
      "endtime" : { $exists: false }
    }, (err, hosts) => {
      if (err) {
        qrdetails = {
          success: false,
          message: 'There was an error with the server. Query Hosts Error. Please contact the administrator.',
          code: ''
        };
      } else {
        console.log('search host success');
        if(hosts.length>=1) {
          //found an active host
          //generate qr shit and connect the sockiets(happens in client)
          var toupdate = hosts[hosts.length-1];
          var qrupdated = Date.now().toString();
          var qr = md5(event.id.toString() + qrupdated);
          qr = qr.substr(qr.length - 5);
          toupdate.save(err => {
            if (err) {
              qrdetails = {
                success: false,
                message: 'There was an error with the server. Update Host Error. Please contact the administrator',
                code: ''
              };
            } else {
              qrdetails = {
                success: true,
                message: 'QR code successfully regenerated.',
                code: qr
              };
            }
          });
        }
        else {
          //no active host, create one
          var now = new Date();
          var end = now;
          var qrupdated = Date.now().toString();
          var qr = md5(event.id.toString() + qrupdated);
          qr = qr.substr(qr.length - 5);
          // end.setHours(end.getHours() + 12);
          let newHost = new Host();
          newHost.event = event.id;
          newHost.host = event.owner;
          newHost.starttime = now.toISOString();
          newHost.qr = qr;
          newHost.save(err => {
            if (err) {
              qrdetails = {
                success: false,
                message: 'Error in creating Host Server',
                code: ''
              };
            } else {
              qrdetails = {
                success: false,
                message: 'Successfully created host',
                code: newHost.qr
              };
            }
          });
        }
      }
    });
      client.emit('qrcode', qrcode);
    }, 10000);
  });
  client.on('disconnect', function(){
      console.log( client.id + ' has disconnected');
      clearInterval(qrgenerator);
  });
});

app.server.listen(config.port);
console.log(`started the magic on port ${app.server.address().port}`);

export default app;