const CART =require ("../../models/cart");
const PRODUCT = require ("../../models/productModel")


const addToCart = async(req,res)=>{
    try {
        const {userId, guestId, productId, quantity } = req.body;

        const product = await PRODUCT.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        // find user or guest id
        const query = userId ? { userId } : { guestId };
        let cart = await CART.findOne(query);
// create new cart
        if (!cart) {
            cart = new CART({
              userId: userId || null,
              guestId: guestId || null,
              cartItems: [],
              totalAmount: 0,
            });
        }
        // check cart if product already exixtes
        const existingItemIndex = cart.cartItems.findIndex(
            (item) => item.productId.toString() === productId
          );
      
          if (existingItemIndex !== -1) {
            // If product exists, update quantity
            cart.cartItems[existingItemIndex].quantity += quantity;
          } else {
            cart.cartItems.push({
              productId: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              quantity,
            });
        }

        // Update total amount
        cart.totalAmount = cart.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        await cart.save();  
        res.status(200).json({
          success: true,
          message: "Item added to cart successfully",
          data:cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

// fetch cart items

const getCartItems = async (req, res) => {
    try {
      const { userId, guestId } = req.query; // from query parameters

      if (!userId && !guestId) {
        return res.status(400).json({
          success: false,
          message: "Either userId or guestId must be provided",
        });
      }

      const query = userId ? { userId } : { guestId };
      const cart = await CART.findOne(query);
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart is empty",
        });
      }
      res.status(200).json({
        success: true,
        data: cart.cartItems,
        totalAmount: cart.totalAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the cart items",
      });
    }
  };


//   update cart items quantity 

const updateCartItemQty = async (req, res) => {
    try {
      const { userId, guestId, productId, quantity } = req.body;
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than zero",
        });
      }
  
      // Find the cart based on userId or guestId
      const query = userId ? { userId } : { guestId };
      const cart = await CART.findOne(query);
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }
  
      // Find the product in the cart
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found in the cart",
        });
      }
  
      // Update the quantity
      cart.cartItems[itemIndex].quantity = quantity;
  
      // Recalculate the total amount
      cart.totalAmount = cart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await cart.save();
  
      res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating cart item quantity",
      });
    }
  };

//   delete cart item
const deleteCartItem = async (req, res) => {
    try {
      const { userId, guestId, productId } = req.body;
  
      // Find the cart based on userId or guestId
      const query = userId ? { userId } : { guestId };
      const cart = await CART.findOne(query);
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }
  
      // Find the index of the product to delete
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Product not found in the cart",
        });
      }
  
      // Remove the item from the cart
      cart.cartItems.splice(itemIndex, 1);
  
      // Recalculate the total amount
      cart.totalAmount = cart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the cart item",
      });
    }
  };


module.exports = { addToCart,getCartItems , updateCartItemQty,deleteCartItem };