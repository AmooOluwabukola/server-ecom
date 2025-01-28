
const express = require("express");
const router = express.Router();

const {
  registration,
  login,
  getUserDetails,
  updateUserRole,
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth/auth");

const { authenticate, authorize } = require("../../middleware/auth");

// Register a new user
router.post("/register", registration);

// Login user
router.post("/login", login);

// Get user details (authenticated users only)
router.get("/user", authenticate, getUserDetails);

// Update user role (admin only)
router.put("/updaterole/:userId", authenticate, authorize(["admin"]), updateUserRole);

// forgot password
router.post ('/forgotpassword',forgotPassword);

// Reset Password
router.post("/resetpassword/:token", resetPassword);

module.exports = router;

