import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 2592000;
const SECRET = "all 1z w3lL";

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
	console.log(req.user.id)
	req.token = req.token || {};
	req.token = jwt.sign({
		id: req.user.id,
	}, SECRET, {

	});
	next();
}

let respond = (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user.username,
		token: req.token
	});
}

module.exports = {
	authenticate,
	generateAccessToken,
	respond
}