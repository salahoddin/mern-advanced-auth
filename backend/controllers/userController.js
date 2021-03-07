const crypto = require('crypto')
const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')

exports.register = async (req, res, next) => {
	const { username, email, password } = req.body

	try {
		const user = await User.create({
			username,
			email,
			password,
		})
		sendToken(user, 201, res)
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
		const isMatch = await user.matchPasswords(password)

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}
		sendToken(user, 200, res)
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
}

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			return next(new ErrorResponse('Email could not be sent', 404))
		}

		const resetToken = user.getResetPasswordToken()

		await user.save()

		const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`
		const message = `
		<h1>You have requested a password reset</h1>
		<p>Please go to this link to reset your password</p>
		<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`
		try {
			await sendEmail({
				to: user.email,
				subject: 'Password reset request',
				text: message,
			})

			res.status(200).json({
				success: true,
				data: 'Email sent, check your inbox or spam folder for the reset link',
			})
		} catch (error) {
			// clear token/expire if there's an error
			user.resetPasswordToken = undefined
			user.resetPasswordExpire = undefined

			await user.save()
			return next(new ErrorResponse('Email cound not be sent', 500)) // 500 is server error
		}
	} catch (error) {
		next(error)
	}
}

exports.resetPassword = async (req, res, next) => {
	let resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex')

	try {
		const user = await User.findOne({
			resetPasswordToken: resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		})

		if (!user) {
			return next(new ErrorResponse('Invalid reset token', 400)) // 400 bad request
		}

		// reassign to new password
		user.password = req.body.password

		// reset variables
		resetPasswordToken = undefined
		resetPasswordExpire = undefined

		await user.save()

		res.status(201).json({
			success: true,
			data: 'Password has been reset successfully',
		})
	} catch (error) {
		next(error)
	}
}

// make it a method to avoid retyping over and over
const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken()
	res.status(statusCode).json({
		success: true,
		token: token,
	})
}
