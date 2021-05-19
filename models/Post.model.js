const { Schema, model } = require("mongoose");


require('./User.model')
require('./Recipe.model')
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    picture: String,
    description: String,
    recipe: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
