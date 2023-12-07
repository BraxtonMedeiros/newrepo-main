// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require('../utilities/account-validation')

router.get("/", Util.checkLogin, Util.handleErrors(accController.accountManagement));

router.get("/profile", Util.checkLogin, Util.handleErrors(accController.buildAccount))

router.get("/login", Util.handleErrors(accController.buildLogin));

router.get("/register", Util.handleErrors(accController.buildRegister));

router.get("/update/:account_id", Util.handleErrors(accController.buildAccountUpdate))

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

router.post(
  "/updateInfo",
  regValidate.accountInfoRules(),
  regValidate.checkAccountInfoData,
  Util.handleErrors(accController.updateAccountInfo)
)

router.post(
  "/updatePassword",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  Util.handleErrors(accController.updatePassword)
)

router.get("/logout", Util.handleErrors(accController.logout));

module.exports = router;