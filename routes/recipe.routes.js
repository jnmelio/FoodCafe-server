const router = require("express").Router();
const uploader = require("../config/cloudinary.config.js");
// require models
const RecipeModel = require("../models/Recipe.model");
const PostModel = require("../models/Post.model");
const ChatModel = require("../models/Message.model");
const UserModel = require('../models/User.model')



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

//RECIPE DETAILS GET
router.get("/recipe/:id", (req, res) => {
  
  RecipeModel.findById(req.params.id)
  .populate('created_by')
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

//RECIPE DETAILS ADD TO MY RECIPES
router.post("/recipe/:recipeId", (req, res) => {
  const {recipeId} = req.params
  const {_id} = req.session.loggedInUser
  UserModel.findByIdAndUpdate(_id, {$push: {recipe:recipeId}}, {new: true})
    .then((response) => {
      req.session.loggedInUser = response
      console.log('add recipe', response)
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

  RecipeModel.findByIdAndUpdate(id,
    {
      $set: {
        name:name,
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
      console.log(response)
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

//DELETE RECIPES
router.delete("/recipe/:id", (req, res) => {
  RecipeModel.findByIdAndDelete(req.params.id)
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


//CLOUDINARY
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
