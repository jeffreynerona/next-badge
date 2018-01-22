'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _passportLocalMongoose = require('passport-local-mongoose');

var _passportLocalMongoose2 = _interopRequireDefault(_passportLocalMongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var User = new Schema({
				email: String,
				password: String,
				type: String,
				coins: Number
}, { timestamps: true });

// generating a hash
User.methods.generateHash = function (password) {
				return _bcryptNodejs2.default.hashSync(password, _bcryptNodejs2.default.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function (password) {
				return _bcryptNodejs2.default.compareSync(password, this.password);
};

module.exports = _mongoose2.default.model('User', User);
//# sourceMappingURL=user.js.map