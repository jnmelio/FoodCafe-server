const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({

  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: {
    type: String,
    enum: [
      "freeUser",
      "premiumUser",
      "admin"
    ]
  },
  picture: String,
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }
});

const User = model("User", userSchema);

module.exports = User;
