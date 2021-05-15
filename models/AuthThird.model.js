const { Schema, model } = require("mongoose");


//THIS IS THE MODEL FOR THE AUTH WITH FB
const userSchema = new Schema({
	username: {
		type: String,
	},
	firstName: String,
	lastName: String,
	email: String,
	image: String,
	linkedInId: String,
	googleId: String,
	facebookId: String,
	password: String,
});


const User = model("User", userSchema);
module.exports = User;