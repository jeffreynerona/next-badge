import mongoose from 'mongoose';
import { Router } from 'express';
import Vivixx from '../model/vivixx';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import { generateAccessToken, respond, authenticate } from '../middleware/authMiddleware';

export default ({ config, db}) => {
	let api = Router();

	// '/v1/vivixx/add'
	api.post('/add', authenticate, (req, res, next) => {
		let newStudent = new Vivixx();
		newStudent.name = req.body.name;
		newStudent.email = req.body.email;
		newStudent.facebook = req.body.facebook;
		newStudent.linkedin = req.body.linkedin;
		newStudent.github = req.body.github;
		newStudent.save(err => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'Student saved successfully'
				});
			}
		});
	});

	api.get('/', (req,res) => {
		Vivixx.find({}, (err, vivix) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(vivix);
			}
		});
	});

	// '/v1/vivixx/:id' - read 1
	api.get('/:id', (req, res) => {
		Vivixx.findById(req.params.id, (err, vivix) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(vivix);
			}
		});
	});

	return api;
}