/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventroyRoute = require("./routes/inventroyRoute")
const baseController = require("./controllers/baseController")
const utilities = require('./utilities/')


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventroyRoute);

// Error routes
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  let imgSrc = err.imgSrc
  console.error(err + ': I hope that helps...');
  res.status(500).render('errors/error', {
    title: '500 Internal Server Error',
    nav,
    imgSrc
  });
});

app.get("/error", baseController.buildCaughtError);

app.use(async (req,res, next) => {
  next({status: 404, message: 'Oops! It looks like Johnny took a wrong turn. The page you are searching for is not here :/', imgSrc: '/images/site/images.jpeg'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let imgSrc = err.imgSrc
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ 
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
    imgSrc = ''
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    imgSrc
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
