import mongoose from 'mongoose';
import Event from './event';
import User from './user';
let Schema = mongoose.Schema;

let AttendSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	}
},{timestamps: true});

module.exports = mongoose.model('Attend', AttendSchema);