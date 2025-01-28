const express =require ('express');
const router = express.Router();
const {addToCart,getCartItems, updateCartItemQty,deleteCartItem} = require ("../../controllers/shop/cart")

// add to cart
router.post("/add", addToCart);
// fetch cart items

router.get("/get", getCartItems);
// update cart item qty
router.put ("/update", updateCartItemQty)
// delete item
router.delete ('/delete', deleteCartItem)

module.exports = router;