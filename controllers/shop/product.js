const PRODUCT = require("../../models/productModel");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
  
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    

    const products = await PRODUCT.find(filter);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await PRODUCT.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };