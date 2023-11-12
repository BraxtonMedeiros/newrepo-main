// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const Util = require("../utilities");
const addValidate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", Util.handleErrors(invController.buildByVehicleId));

router.get("/", Util.handleErrors(invController.buildManagement));

router.get("/addNewClassification", Util.handleErrors(invController.buildAddNewClassification));

router.post(
    '/addNewClassification',
    addValidate.addClassRules(),
    addValidate.checkAddClassData,
    Util.handleErrors(invController.addClassification));

router.get("/addNewInventory", Util.handleErrors(invController.buildAddNewInventroy));

router.post(
    '/addNewInventory',
    addValidate.addInvRules(),
    addValidate.checkAddInvData,
    Util.handleErrors(invController.addInventory));

module.exports = router;