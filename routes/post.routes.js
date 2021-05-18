const router = require("express").Router();
const uploader = require('../config/cloudinary.config.js');

// require models
const RecipeModel = require('../models/Recipe.model');
const PostModel = require('../models/Post.model');
const UserModel = require('../models/User.model')

router.get("/posts", (req, res) => {
  PostModel.find()
    .populate('user')
    .populate('recipe')
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.post("/new-post", (req, res) => {
  const {
    user, picture, description, recipe
  } = req.body;
  console.log(picture)
  PostModel.create({
    user, picture, description, recipe
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

// upload picture route http://localhost:5005/api/upload      
// imageUrl is the input name in your hbs file
router.post('/upload', uploader.single("imageUrl"), (req, res, next) => {
  console.log('file is: ', req.file)
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  //You will get the image url in 'req.file.path'
  //store that in the DB  
  res.status(200).json({
    picture: req.file.path
  })
})
module.exports = router;