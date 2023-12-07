const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        console.log("emailExists:", emailExists)
        if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /* ******************************
  * Login Data Validation Rules
  * ***************************** */
  validate.loginRules = () => {
      return [
        // email is required and must be string
        body("account_email")
          .trim()
          .isLength({ min: 1 })
          .withMessage("Please provide an email address."), // on error this message is sent.
    
        // password is required and must be string
        body("account_password")
          .trim()
          .isLength({ min: 1 })
          .withMessage("Please provide a password."), // on error this message is sent.
      ]
    }
  
    /* ******************************
    * Check data and return errors or continue to login
    * ***************************** */
    validate.checkLoginData = async (req, res, next) => {
      const { account_email, account_password } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email,
          account_password,
        })
        return
      }
      next()
    }
  
    /* ******************************
    * Account Info Validation Rules
    * ***************************** */
    validate.accountInfoRules = (req) => {
      return [
        // firstname is required and must be string
        body("account_firstname")
          .trim()
          .isLength({ min: 1 })
          .withMessage("Please provide a first name."), // on error this message is sent.
    
        // lastname is required and must be string
        body("account_lastname")
          .trim()
          .isLength({ min: 2 })
          .withMessage("Please provide a last name."), // on error this message is sent.
    
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
          const account_id = req.body.account_id
          console.log(account_id)
          const account = await accountModel.getAccountById(account_id)
   // No - Check if email exists in table
          if (account_email != account.account_email) {
          const emailExists = await accountModel.checkExistingEmail(
            account_email
            )
            // Yes - throw error
          if (emailExists) {
          throw new Error("Email exists. Please use a different email")
          }
          }
        })
      ]
  
    }

    validate.checkAccountInfoData = async (req, res, next) => {
      const { account_firstname, account_lastname, account_email } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
          errors,
          title: "Update Account",
          nav,
          account_firstname,
          account_lastname,
          account_email,
        })
        return
      }
      next()
  
  
    }

    validate.passwordRules = () => {
      return [
        body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
    }

    validate.checkPasswordData = async (req, res, next) => {
      const {accountData} = res.locals
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
          errors,
          title: "Update Account",
          nav,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email
        })
        return
    }
    next()
  }
  
  module.exports = validate