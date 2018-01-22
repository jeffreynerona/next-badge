import mongoose from 'mongoose';
import Attend from './attend';
import User from './user';

let Schema = mongoose.Schema;

let eventSchema = new Schema({
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
	location: {
		type: String,
		required: true
	},
	starttime: {
		type: Date,
		required: true
	},
	endtime: {
		type: Date,
		required: true
	},
	image: {
		type: String
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
},{timestamps: true});

module.exports = mongoose.model('Event', eventSchema);