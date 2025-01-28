
const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProduct,editProduct, deleteProduct } = require("../../controllers/admin/product");
const upload = require ("../../config/multerConfig")


// create route
router.post('/createproduct', upload.single("image"), createProduct);



// getallproducts route
router.get('/', getAllProducts);

// getproductbyId route
router.get('/:productId', getProduct);

// edit product route
router.put('/:productId', upload.single("image"), editProduct);

// delete route
router.delete('/:productId', deleteProduct);

module.exports = router;