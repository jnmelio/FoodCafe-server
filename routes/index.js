const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)
const allRoutes = require('./routes');
app.use('/api', allRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const recipeRoutes = require('./routes/recipe.routes');
app.use('/api', recipeRoutes);

const postRoutes = require('./routes/post.routes');
app.use('/api', postRoutes);

const chatRoutes = require('./routes/chat.routes')
app.use('/api', chatRoutes)

module.exports = router;
