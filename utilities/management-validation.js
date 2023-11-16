const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

// Add classification validation rules
validate.addClassRules = () => {
    return [
        body("classification_name")
        .matches(/^[A-Za-z]+$/)
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please type only alphabetic letters with no spaces. It must be at least 3 letters.")
        .custom(async (classification_name) => {
            const reg = /^[a-zA-Z0-9]*$/
            if (!reg.test(classification_name)) {
                throw new Error("Please type only alphabetic letters with no spaces. It must be at least 3 letters.")
            }
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists) {
                throw new Error("A classification with that name ALREADY exists. Please use a new classification name.")
            }
        })
    ]
};

// Check data and return errors or continue
validate.checkAddClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/addClassification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

// Add inventory validation rules
validate.addInvRules = () => {
    return [
        body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Make must be at least 3 characters"),

        body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters"),

        body("inv_year")
        .trim()
        .isLength({ min: 4 })
        .matches(/^(19[0-9]\d|20\d{2})$/)
        .withMessage("Year must be 4 digits and between 1900-2099"),

        body("inv_description")
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage("Description must be between 3 and 1000 characters"),

        body("inv_image")
        .trim()
        .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("Image must be jpg, jpeg, png, or webp format"),

        body("inv_thumbnail")
        .trim()
        .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("Image must be jpg, jpeg, png, or webp format"),

        body("inv_price")
        .trim()
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage("Price must be numbers only, no dollar sign needed"),

        body("inv_miles")
        .trim()
        .matches(/^[0-9]{1,7}$/)
        .withMessage("Miles must be a number between 0 and 9,999,999 without commas"),

        body("inv_color")
        .trim()
        .matches(/^[a-zA-Z]{3,}$/)
        .withMessage("Color must be only alphabetic letters and at least 3 characters"),

        body("classification_id")
        .matches(/^[0-9]$/)
        .withMessage("Please select a classification from the dropdown")
    ]
};

// Check add Inv data and return errors or continue
validate.checkAddInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let options = await utilities.buildClassificationOptions()
        res.render("./inventory/addInventory", {
            errors,
            title: "Add Inventory",
            nav,
            options,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
        return
    }
    next()
}

module.exports = validate