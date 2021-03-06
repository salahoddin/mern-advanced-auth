const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const mailgun = require('mailgun-js')({
	apiKey: MAILGUN_API_KEY,
	domain: MAILGUN_DOMAIN,
})

const sendEmail = (options) => {
	const data = {
		from: process.env.EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.text,
	}

	mailgun.messages().send(data, (error, body) => {
		if (error) {
			console.log(error)
		}
		console.log(body)
	})
}
module.exports = sendEmail
