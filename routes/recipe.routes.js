const router = require("express").Router();
const uploader = require("../config/cloudinary.config.js");
// require models
const RecipeModel = require("../models/Recipe.model");
const PostModel = require("../models/Post.model");
const ChatModel = require("../models/Chat.model");



//GET THE RECIPES
router.get("/recipe", (req, res) => {
  RecipeModel.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//POST A RECIPE
router.post("/recipe/add", (req, res) => {
  const {
    name,
    ingredients,
    instructions,
    youtube,
    picture,
    description,
    cookingTime,
    difficulty,
    country,
    category,
    vegetarian,
    created_by
  } = req.body;

  RecipeModel.create({
    name,
    ingredients,
    instructions,
    youtube,
    picture,
    description,
    cookingTime,
    difficulty,
    created_by,
    country,
    category,
    vegetarian,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({

        error: "Something went wrong",
        message: err,
      });
    });
});

//RECIPE DETAILS
router.get("/recipe/:id", (req, res) => {
  RecipeModel.findById(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});



//EDIT A RECIPE
router.patch("/recipe/:id", (req, res) => {
  let id = req.params.id;
  const {
    name,
    ingredients,
    instructions,
    youtube,
    picture,
    description,
    cookingTime,
    difficulty,
    created_by,
    country,
    category,
    vegetarian,
  } = req.body;
  console.log(picture[0].path)
  RecipeModel.findOneAndUpdate(
    id,
    {
      $set: {
        name,
        ingredients,
        instructions,
        youtube,
        picture,
        description,
        cookingTime,
        difficulty,
        created_by,
        country,
        category,
        vegetarian,
      },
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//DELETE RECIPES
router.delete("/recipe/:id", (req, res) => {
  RecipeModel.findOneAndDelete(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// upload picture route http://localhost:5005/api/upload
// imageUrl is the input name in your hbs file
router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  //You will get the image url in 'req.file.path'
  //store that in the DB
  res.status(200).json({
    picture: req.file.path,
  });
});

module.exports = router;
