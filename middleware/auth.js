const jwt = require("jsonwebtoken");


// lets authenticate
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token" });
  }
};


// authorize
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You do not have the required role.",
    });
  }
  next();
};

module.exports = { authenticate, authorize };
