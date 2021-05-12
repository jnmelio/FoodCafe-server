const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    ingredients: { type: Array, required: true },             //???
    instructions: { type: String, required: true },
    youtube: String,
    picture: String,
    description: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    difficulty: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    country: String,
    category: String,
    vegetarian: Boolean
  },
  {
    timestamps: true
  }

);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
