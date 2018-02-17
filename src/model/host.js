import mongoose from 'mongoose';
import Event from './event';
import User from './user';

let Schema = mongoose.Schema;

let hostSchema = new Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	host: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	starttime: {
		type: Date,
		required: true
	},
	endtime: {
		type: Date
	},
	qr: {
		type: String
	}
},{timestamps: true});

module.exports = mongoose.model('Host', hostSchema);