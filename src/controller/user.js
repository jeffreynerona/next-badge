import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db}) => {
	let api = Router();

	// '/v1/user/register'
	api.post('/register',passport.authenticate(
		'local-register', {
			session: false,
			scope: []
		}), (err, req, res,next) => {
			if (err) {
				console.log(err);
				return res.status(200).json({
					success: false,
					message: err
				});
			} 
			next()
	},(req, res) => {
		res.status(200).json({
			success: true,
			message: "User has been created"
		});
	});

	// '/v1/user/login'
	api.post('/login', passport.authenticate(
		'local-login', {
			session: false,
			scope: []
		}),(err, req, res, next) => {
			if(err) {
				return res.status(200).json({success: false, message:err})
			}
			next()
		}, generateAccessToken, respond);

	// 'v1/user/logout'
	api.get('/logout', authenticate, (req, res) => {
		res.logout();
		res.status(200).send('Successfully logged out');
	});
	api.get('/error', (req, res) => {
		res.status(200).json({
			success: false,
			message: "There was an error"
		});
	});

	api.get('/me', authenticate, (req,res) => {
		console.log("authenticated");
		res.status(200).json({
			success: true,
			message: "Authenticated"
		});
	});

	return api;
}