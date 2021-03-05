const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse')

exports.register = async (req, res, next) => {
	const { username, email, password } = req.body

	try {
		const user = await User.create({
			username,
			email,
			password,
		})

		res.status(201).json({
			success: true,
			user: user,
		})
	} catch (error) {
		next(error)
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body

	if (!email || !password) {
		return next(new ErrorResponse('Please provide email and password', 400))
	}

	try {
		// find the user by email
		const user = await User.findOne({ email }).select('+password')

		// check for user
		if (!user) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}
		const isMatch = user.matchPasswords(password)

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}
		res.status(200).json({
			success: true,
			token: 'sdfsdfadf',
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
}

exports.forgotPassword = (req, res, next) => {
	res.send('Forgot PW Route')
}

exports.resetPassword = (req, res, next) => {
	res.send('Reset PW Route')
}
