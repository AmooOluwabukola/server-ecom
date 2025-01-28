const PRODUCT = require ("../../models/productModel")

const searchProducts = async (req, res) => {
    try {
      const { query } = req.query; // Retrieve the search term from query parameters
  
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }
  
      // Use MongoDB's $regex for a case-insensitive partial match
      const products = await PRODUCT.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
  
      res.status(200).json({
        success: true,
        results: products.length,
        data: products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while searching for products",
      });
    }
  };
  
  module.exports = { searchProducts };
  