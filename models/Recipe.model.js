const { Schema, model } = require("mongoose");


//THIS IS THE MODEL FOR A RECIPE
const recipeSchema = new Schema(
  {

    name: { type: String, required: true },
    ingredients: { type: [String], required: true },             //???
    instructions: { type: String, required: true },
    youtube: String,
    picture: String,
    description: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    difficulty: String,
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    country: String,
    category: String,
    vegetarian: Boolean,
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
