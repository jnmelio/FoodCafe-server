const router = require("express").Router();
const bcrypt = require("bcryptjs");
// CLOUDINARY
const uploader = require("../config/cloudinary.config.js");

// MODELS
const UserModel = require("../models/User.model");
const RecipeModel = require("../models/Recipe.model");

// MIDDLEWARE
const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

// SIGN UP ROUTE
router.post("/signup", (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    usertype,
    picture,
    recipe,
  } = req.body;
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
  UserModel.create({
    username,
    firstName,
    lastName,
    email,
    password: hash,
    usertype,
    picture,
    recipe,
  })
    .then((user) => {
      // ensuring that we don't share the hash as well with the user
      user.passwordHash = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "Username or email already exists!",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Something went wrong! Go to sleep!",
          message: err,
        });
      }
    });
});

//LOGIN ROUTE
router.post("/login", (req, res) => {
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
    .populate('myFriends')
    .populate('recipe')
    .then((user) => {
      //check if passwords match
      bcrypt
        .compare(password, user.password)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            console.log("user loged in");
            user.password = "***";
            req.session.loggedInUser = user;
            res.status(200).json(user);
          }
          //if passwords do not match
          else {
            console.log("fail");
            res.status(500).json({
              error: "Passwords do do not match",
            });
            return;
          }
        })
        .catch(() => {
          console.log("nail");
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Email does not exist",
        message: err,
      });
      return;
    });
});

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).json({});
});

//RANDOM RECIPE AND USER AFTER SIGN UP ROUTE GET
router.get("/signup", isLoggedIn, (req, res, next) => {
  Promise.all([RecipeModel.find(), UserModel.find()])
    .then(([recipeResponse, userResponse]) => {
      let randomRecipe =
        recipeResponse[Math.floor(Math.random() * recipeResponse.length)];
      let randomUser =
        userResponse[Math.floor(Math.random() * userResponse.length)];
      res.status(200).json({ randomRecipe, randomUser });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

//RANDOM RECIPE AFTER SIGN UP ROUTE POST
router.post("/addRecipe/:randomRecipe", (req, res, next) => {
  const { randomRecipe } = req.params;
  console.log("random recipe", req.params);
  const { _id } = req.session.loggedInUser;
  UserModel.findByIdAndUpdate(
    _id,
    { $push: { recipe: randomRecipe } },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

//RANDOM FRIEND AFTER SIGN UP ROUTE POST
router.post("/addFriend/:randomUser", (req, res, next) => {
  const { randomUser } = req.params;
  const { _id } = req.session.loggedInUser;
  UserModel.findByIdAndUpdate(
    _id,
    { $push: { myFriends: randomUser } },
    { new: true }
  )
    .then((response) => {
      req.session.loggedInUser = response
      res.status(200).json(response);
    })
    .catch(() => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});


//TIMELINE ROUTE
router.get("/timeline", isLoggedIn, (req, res, next) => {
  const { _id } = req.session.loggedInUser;
  UserModel.findById(_id)
    .populate("myFriends")
    // populate inside the populated element
    .populate({
      path: 'myFriends',
      populate: 'recipe'
    })
    .populate('recipe')
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

//ALL USERS ROUTE
router.get("/users", (req, res) => {
  UserModel.find()
    .populate("recipe")
    .populate("myFriends")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// FACEBOOK AUTH
// The client makes a API request to this url sending the data in the body
router.post("/facebook/info", (req, res, next) => {
  const {name, email, image, facebookId} = req.body
  // the name itself will include the last name
  try {
    // Create the user in the DB
    UserModel.create({firstName: name, facebookId, image, email})
      .then((response) => {
        // Save the loggedInInfo in the session
        // We'll stick to using sessions just to not over complicate the students with tokens and cookies
        req.session.loggedInUser = response
        res.status(200).json({data: response})
      })
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

//GOOGLE AUTH 
// The client makes a API request to this url sending the data in the body
router.post("/google/info", (req, res, next) => {
  const {firstName, lastName, email, image, googleId} = req.body
  // the name itself will include the last name
  try {
    UserModel.find({email:email})
    .then((result) => {
      if(result.length == 0 ){
        // Create the user in the DB
    UserModel.create({firstName, lastName, googleId, profilePic:image, email})
    .then((response) => {
      // Save the loggedInInfo in the session
      // We’ll stick to using sessions just to not over complicate the students with tokens and cookies
      req.session.loggedInUser = response
      res.status(200).json({data: response})
    })
      }else{
        req.session.loggedInUser = result[0]
        res.status(200).json({data: result[0]})
      }
    }).catch((err) => {
      console.log(err)
    });
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

// Protected route
// will handle all get requests to http://localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
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
