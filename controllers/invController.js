const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className = ""
  if (data.length > 0 ) {
    className = data[0].classification_name
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const data = await invModel.getInventoryByVehicleId(inventoryId)
  const vehicle = data[0];
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const options = await utilities.buildClassificationOptions()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    options, 
    errors: null
  })
}

invCont.buildAddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

// Process Adding classification
invCont.addClassification = async function (req, res) {
  
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added ${classification_name} to Classifications!`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed. Please try again.")
    res.status(501).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}


invCont.buildAddNewInventroy = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.buildClassificationOptions()
  res.render("./inventory/addInventory", {
    title: "Add New Inventory",
    nav,
    options,
    errors: null
  })
}

invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added ${inv_make} ${inv_model} to Inventory!`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    let nav = await utilities.getNav()
    let options = await utilities.buildClassificationOptions()
    req.flash("notice", "Sorry, adding the vehicle failed. Please try again.")
    res.status(501).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async (req, res, next) => {
  const vehicleId = parseInt(req.params.inv_id)
  const vehicleData = await invModel.getInventoryByVehicleId(vehicleId)
  const options = await utilities.buildClassificationOptions()
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  let nav = await utilities.getNav()
  res.render("./inventory/edit-inventory", {
    title: "Edit " + vehicleName,
    nav,
    options,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    inv_color: vehicleData[0].inv_color,
    classification_id: vehicleData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont