'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _badge = require('./badge');

var _badge2 = _interopRequireDefault(_badge);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var IssueSchema = new Schema({
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
}, { timestamps: true });

module.exports = _mongoose2.default.model('Issue', IssueSchema);
//# sourceMappingURL=issue.js.map