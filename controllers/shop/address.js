const ADDRESS = require("../../models/address");

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { userId, guestId, address, city, pincode, phone, notes } = req.body;

    // Ensure required fields are provided
    if (!address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Address, city, pincode, and phone are required.",
      });
    }

    const newAddress = new ADDRESS({
      userId: userId || null,
      guestId: guestId || null,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully!",
      data: savedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};

// Get all addresses for a user or guest
const getAddresses = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    // Fetch addresses based on userId or guestId
    const query = userId ? { userId } : { guestId };
    const addresses = await ADDRESS.find(query);

    res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully!",
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { address, city, pincode, phone, notes } = req.body;

    const updatedAddress = await ADDRESS.findByIdAndUpdate(
      addressId,
      { address, city, pincode, phone, notes },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully!",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const deletedAddress = await ADDRESS.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};
