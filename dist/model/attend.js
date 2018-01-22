'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var AttendSchema = new Schema({
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
}, { timestamps: true });

module.exports = _mongoose2.default.model('Attend', AttendSchema);
//# sourceMappingURL=attend.js.map