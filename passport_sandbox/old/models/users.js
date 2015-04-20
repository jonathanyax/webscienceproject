var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	ussername: String,
	password: String,
	email: String,
	gender: String,
	address: String
});