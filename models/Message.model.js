const { Schema, model } = require("mongoose");
require("./User.model");
require("./Conversation.model");


//THIS IS THE MODEL RELATED TO THE CHAT
// 1. Define your schema
let MessageSchema = new Schema(
  {
    sender: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    message: String,
    conversationId: {
      ref: "Conversation",
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// 2. Define your model
let MessageModel = model("message", MessageSchema);

// 3. Export your Model with 'module.exports'
module.exports = MessageModel;
