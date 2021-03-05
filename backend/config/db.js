const mongoose = require('mongoose')

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
	})

	console.log('MONGO DB Connected')
}

module.exports = connectDB
