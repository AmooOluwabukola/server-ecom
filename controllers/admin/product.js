const PRODUCT = require('../../models/productModel');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2; // Cloudinary configuration should already be set up
const fs = require("fs");

// Create Product
const createProduct = async (req, res) => {
  const { name, price, description, category } = req.body;

  try {
    const existingProduct = await PRODUCT.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ error: "Product with the same name already exists" });
    }
    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageUrl = result.secure_url;
      // Delete the temporary file after upload
      fs.unlinkSync(req.file.path);
    }
    // Create new product
    const newProduct = new PRODUCT({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      image: imageUrl,
      description,
      category,
    });

    const result = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      createdProduct: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", details: err.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const listOfProducts = await PRODUCT.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Get Product by ID
const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await PRODUCT.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, description, category } = req.body;

    // Find the product
    let product = await PRODUCT.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      product.image = result.secure_url;

      // Delete the temporary file after upload
      fs.unlinkSync(req.file.path);
    }
    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred", error: err.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await PRODUCT.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
};
