import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

let Vivixx = new Schema({
	name: String,
	email: String,
	facebook: String,
	linkedin: String,
	github: String
},{timestamps: true});

module.exports = mongoose.model('Vivixx', Vivixx);