'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var badgeSchema = new Schema({
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
}, { timestamps: true });

module.exports = _mongoose2.default.model('Badge', badgeSchema);
//# sourceMappingURL=badge.js.map