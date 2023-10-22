const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.buildCaughtError = async function(req, res) {
  const nav = await utilities.getNav();
  const title = '500 Internal Server Error';
  const message = 'This is an intentional 500 error.';
  const imgSrc = '/images/site/monkey.jpeg'
  res.render("errors/error", {
    nav,
    title,
    message,
    imgSrc
  });
};

module.exports = baseController