const ORDER = require ('../../models/order')

const getAllOrdersOfAllUsers = async (req, res) => {
    try {
      const orders = await ORDER.find({});
  
      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  // order details for admin
  const getOrderDetailsForAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await ORDER.findById(id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  

  // order status
  const updateOrderStatus = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { orderStatus } = req.body;
  
      const order = await ORDER.findById(orderId);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      await ORDER.findByIdAndUpdate(orderId, { orderStatus });
  console.log('Order status updated');
      res.status(200).json({
        success: true,
        message: "Order status is updated successfully!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  module.exports = {
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus,
  };
  