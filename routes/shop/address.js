const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../../controllers/shop/address");

// Add a new address
router.post("/add", addAddress);

// Get addresses (by userId or guestId via query params)
router.get("/get-addresses", getAddresses);

// Update an address
router.put("/:addressId", updateAddress);

// Delete an address
router.delete("/:addressId", deleteAddress);

module.exports = router;
