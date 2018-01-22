import mongoose from 'mongoose';
import User from './user';

let Schema = mongoose.Schema;

let badgeSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	tags: {
		type: Array
	},
	image: {
		type: String,
		required: true
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	limit: {
		type: Number,
		default: 10,
		require: true
	}
},{timestamps: true});

module.exports = mongoose.model('Badge', badgeSchema);