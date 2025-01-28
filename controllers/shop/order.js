const ORDER = require ('../../models/order')

// place order
const placeOrder = async (req, res) => {
    try {
      const { userId, guestEmail, cartItems, addressInfo, paymentMethod, totalAmount } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!userId && !guestEmail) {
      return res.status(400).json({ success: false, message: "User or guest information is required" });
    }

      const newOrder = new ORDER({
       userId: userId || null,
      guestEmail: guestEmail || null,
        cartItems,
        addressInfo,
        orderStatus: "Pending", 
        paymentMethod,
        paymentStatus:'unpaid',
        totalAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      
      });
    
     await newOrder.save();
     res.status(201).json({ success: true, order: newOrder });
     console.error("order created:", newOrder);
   } catch (error) {
     console.error("Error saving order:", error);
     res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
   }

  };

// get orderby user or guest
  const getOrdersByUser = async (req, res) => {
    try {
      const { userId, guestEmail } = req.query;
  
      if (!userId && !guestEmail) {
        return res.status(400).json({ success: false, message: "User ID or guest email is required" });
      }
  
      const query = userId ? { userId } : { guestEmail };
      const orders = await ORDER.find(query).sort({ orderDate: -1 });
  
      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  
  
  module.exports ={placeOrder, getOrdersByUser}