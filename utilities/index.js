const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="carCard">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span class="price">$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  Util.buildVehicleGrid = async function(data) {
    if (data.length > 0) {
        const vehicle = data[0];
        const price = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(vehicle.inv_price);

        const mileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

        return `
            <div id="indiviual_view">
              <div id="carPic">
                <img class="pic" src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
              </div>
              <div id="carInfo">
                <p>Make: ${vehicle.inv_make}</p>
                <p>Model: ${vehicle.inv_model}</p>
                <p>Year: ${vehicle.inv_year}</p>
                <p>Price: ${price}</p>
                <p>Mileage: ${mileage} miles</p>
                <p>Description: ${vehicle.inv_description}</p>
              </div>
            </div>
        `;
    } else {
        return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
}

Util.buildClassificationOptions = async function (req, res, next) {
  let data = await invModel.getClassifications();
    let options = data.rows.map(row => ({
        value: row.classification_id,
        label: row.classification_name,
    }));
    return options;
}

Util.buildClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications();
    let list = '<select name="classification_id" id="classificationList">';
    list += '<option value="0">Choose a classification</option>';
    data.rows.forEach(row => {
        list += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    });
    list += '</select>';
    return list;
}


  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = false
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
*  Check Admin
* ************************************ */
Util.checkAdminAccess = (req, res, next) => {
  const accountData = res.locals.accountData;
  // Check if the user is logged in and has an account type
  if (accountData && accountData.account_type) {
    // Check if the account type is "Employee" or "Admin"
    if (accountData.account_type == "Employee" || accountData.account_type == "Admin") {
      // User has the required access, allow access to the next middleware or route
      next();
    } else {
      // User does not have the required access, redirect to login with appropriate message
      req.flash("error", "You do not have permission to access this resource.");
      res.redirect("/account/login");
    }
  } else {
    // User is not logged in, redirect to login with appropriate message
    req.flash("error", "Please log in to access this resource.");
    res.redirect("/account/login");
  }
};


module.exports = Util