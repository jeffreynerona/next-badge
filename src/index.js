import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

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
	passwordField: 'password'
},
	function(email, password, next) {
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

app.server.listen(config.port);
console.log(`started the magic on port ${app.server.address().port}`);

export default app;