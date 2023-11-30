// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require('../utilities/account-validation')

router.get("/", Util.handleErrors(accController.accountManagement));

router.get("/login", Util.handleErrors(accController.buildLogin));

router.get("/register", Util.handleErrors(accController.buildRegister));

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accController.registerAccount)
  )

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    Util.handleErrors(accController.accountLogin)
  )

router.get("/logout", Util.handleErrors(accController.logout));

module.exports = router;