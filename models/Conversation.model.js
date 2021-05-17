const { Schema, model } = require("mongoose");
require("./User.model");


//THIS IS THE MODEL FOR THE CHAT
// 1. Define your schema
let ConversationSchema = new Schema({
  participants: [
    {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  ],
});

// 2. Define your model
let ConversationModel = model("conversation", ConversationSchema);

// 3. Export your Model with 'module.exports'
module.exports = ConversationModel;
