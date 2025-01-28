const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: { type: String, required: false }, 
  guestId: { type: String, required: false }, 
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false }, 
});

const ADDRESS = mongoose.model("Address", AddressSchema);

module.exports = ADDRESS;
