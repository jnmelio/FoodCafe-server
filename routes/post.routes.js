const router = require("express").Router();
const uploader = require('../config/cloudinary.config.js');

// require models
const RecipeModel = require('../models/Recipe.model');
const PostModel = require('../models/Post.model');
const ChatModel = require('../models/Chat.model');

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