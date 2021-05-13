const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const postSchema = new Schema(
  {
    username: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    picture: String,
    description: String,
    reciep: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  },
  {
    timestamps: true
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
