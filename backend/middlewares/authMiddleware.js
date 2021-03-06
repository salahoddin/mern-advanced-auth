const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	}

	// if there's no token
	if (!token) {
		return next(new ErrorResponse('Not authorized to access this route', 401))
	}

	// verify token, User id is created together with the token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(decoded.id)

		// if user is not found
		if (!user) {
			return next(new ErrorResponse('No user found with this id', 404))
		}

		// if user is found
		req.user = user

		// call next to continue
		next()
	} catch (error) {
		return next(new ErrorResponse('Not authorized to access this route', 401))
	}
}
