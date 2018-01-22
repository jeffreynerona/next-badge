import mongoose from 'mongoose';
import Badge from './badge';
import User from './user';
let Schema = mongoose.Schema;

let IssueSchema = new Schema({
	issuer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	badge: {
		type: Schema.Types.ObjectId,
		ref: 'Badge',
		required: true
	}
},{timestamps: true});

module.exports = mongoose.model('Issue', IssueSchema);