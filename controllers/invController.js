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
  const className = data[0].classification_name
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

module.exports = invCont