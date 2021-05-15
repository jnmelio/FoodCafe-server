const { Schema, model } = require("mongoose");

// THIS IS THE MODEL USER
const userSchema = new Schema({
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  usertype: {
    type: String,
    enum: ["freeUser", "premiumUser", "admin"],
  },
  picture: String,
  recipe: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  myFriends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
