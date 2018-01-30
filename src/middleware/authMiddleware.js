import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 2592000;
const SECRET = "all 1z w3lL";

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
	console.log(req.user.id)
	req.user.id = req.user.id;
	req.user.coins = req.user.coins;
	req.user.type = req.user.type;
	req.user.fullname = req.user.fullname;
	req.token = req.token || {};
	req.token = jwt.sign({
		id: req.user.id,
		fullname: req.user.fullname
	}, SECRET, {
		expiresIn: 604800
	});
	next();
}

let respond = (req, res) => {
	res.status(200).json({
		success: true,
		user: {
			id: req.user.id,
			coins: req.user.coins,
			type: req.user.type,
			fullname: req.user.fullname
		},
		token: req.token
	});
}

module.exports = {
	authenticate,
	generateAccessToken,
	respond
}