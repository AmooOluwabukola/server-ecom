const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // For registered users
  guestEmail: { type: String, default: null }, // For guest users
  cartItems: [
    {
      productId: String,
      name: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  orderUpdateDate: { type: Date, default: Date.now },
  // paymentId: String,
  // payerId: String,
});

const ORDER = mongoose.model("Order", OrderSchema);
module.exports = ORDER;
