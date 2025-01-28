const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/shop/order");

// place a new order
router.post("/place-order", placeOrder);

// Get orders by user
router.get("/get-orders", getOrdersByUser);

// // Update order status
// router.put("/update/:orderId", updateOrderStatus);

// // Delete an order
// router.delete("/delete/:orderId", deleteOrder);

module.exports = router;
