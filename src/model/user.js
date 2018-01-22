import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

let User = new Schema({
	email: String,
	password: String,
	type: String,
	coins: Number
},{timestamps: true});

// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);