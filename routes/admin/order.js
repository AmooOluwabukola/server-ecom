const express = require("express");
const router = express.Router();
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order");



router.get("/", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/:orderId", updateOrderStatus);

module.exports = router;
