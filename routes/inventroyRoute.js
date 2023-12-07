// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const Util = require("../utilities");
const addValidate = require("../utilities/management-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", Util.handleErrors(invController.buildByVehicleId));

router.get("/", Util.checkAdminAccess, Util.checkLogin, Util.handleErrors(invController.buildManagement));

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

router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON));

router.get('/edit/:inv_id', Util.handleErrors(invController.buildEditInventory));

router.post("/update/", addValidate.addInvRules(), addValidate.checkUpdateData, Util.handleErrors(invController.updateInventory));

router.get("/delete/:inv_id", Util.handleErrors(invController.deleteInventoryView));

router.post("/delete", Util.handleErrors(invController.deleteInventory));

module.exports = router;