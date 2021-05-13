const router = require("express").Router();
const bcrypt = require('bcryptjs');
// cloudinary
const uploader = require('../config/cloudinary.config.js');

// require  models
const UserModel = require('../models/User.model');

// Sign up post route      http://localhost:5005/api/signup

router.post('/signup', (req, res) => {
  const { username, firstName, lastName, email, password, usertype, picture, recipe } = req.body;
  // -----SERVER SIDE VALIDATION ----------
  /* 
  if (!username || !email || !password) {
      res.status(500)
        .json({
          errorMessage: 'Please enter username, email and password'
        });
      return;  
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
        errorMessage: 'Email format not correct'
      });
      return;  
  }
  const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet'
    });
    return;  
  }
  */


  // password encryption with bcrypt
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({ username, firstName, lastName, email, password: hash, usertype, picture, recipe })
    .then((user) => {
      // ensuring that we don't share the hash as well with the user
      user.passwordHash = "***";
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: 'Username or email already exists!',
          message: err,
        });
      }
      else {
        res.status(500).json({
          errorMessage: 'Something went wrong! Go to sleep!',
          message: err,
        });
      }
    })
});


// Login post route
// will handle all POST requests to http://localhost:5005/api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // -----SERVER SIDE VALIDATION ----------
  /*
  if ( !email || !password) {
      res.status(500).json({
          error: 'Please enter email and password',
     })
    return;  
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
          error: 'Email format not correct',
      })
      return;  
  }
  */

  // Find if the user exists in the database 
  UserModel.findOne({ email })
    .then((userData) => {
      //check if passwords match
      bcrypt.compare(password, userData.password)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            userData.password = "***";
            req.session.loggedInUser = userData;
            res.status(200).json(userData)
          }
          //if passwords do not match
          else {
            console.log('fail')
            res.status(500).json({
              error: 'Passwords do do not match',
            })
            return;
          }
        })
        .catch(() => {
          console.log('nail')
          res.status(500).json({
            error: 'Email format not correct',
          })
          return;
        });
    })
    //throw an error if the user does not exists 
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: 'Email does not exist',
        message: err
      })
      return;
    });

});

// will handle all POST requests to http://localhost:5005/api/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(204).json({});
})

// middleware to check if user is loggedIn
const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next()
  }
  else {
    res.status(401).json({
      message: 'Unauthorized user',
      code: 401,
    })
  };
};
// Protected route
// will handle all get requests to http://localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});


// cloudinary
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
