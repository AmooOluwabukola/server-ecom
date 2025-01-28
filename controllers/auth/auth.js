const { json } = require('express');
const USER = require('../../models/userModel');
const jwt =require("jsonwebtoken");
const crypto = require ("crypto")
const bcrypt =require ('bcrypt')
const Mailer = require ("../../helpers/Mailer")


// registration
const registration = async (req, res) => {

  try {
    const { userName, email, password, role ,phone} = req.body;

    // Check if user already exists
    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
     
    const existingUserName = await USER.findOne({userName});
    if(existingUserName){
        res.status(400).json({success:false,message:"Username already in use"});
        return
    };

    const user = await USER.create({...req.body});
    res.status(201).json({success:true,message:'registration successful', data: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      phone:user.phone,

    },})
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }

}



// login
const login = async (req,res)=>{
  try {
      const {email,password} =req.body;
      if (!email|| !password){
          res.status (400).json({success:false, message:"all fields are required"});
          return;
      }
      // finding registered email address
      const user = await USER.findOne ({email});
      if(!user){
          res.status(404).json ({success:false, message:"wrong credentials"})
          return;
      }

      // comparing password and validating password
      const auth = await user.comparePassword(password);
      if (!auth){
          res.status (404).json ({success:false, message:"password doesnt match"})
          return;
      }

      // generating token
      const token = await user.generateToken();
      console.log(token);
      if (token){
          res.status(201).json ({
              success: true,
               message:"logged in succesfully",
               user:{
                  userName:user.userName,
                  email:user.email,
                  token
               }           

  });
  return
      }
    
  } catch (error) {
      console.log(error.message);
      res.status(500).json (error.message)
  }
}
// get userName
const getUserName =async (req, res)=>{
    const {userId} = req.user;
    const user = await USER.findOne({_id:userId})
    res.status(200).json ({success:true, userName:user.userName})
}

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await USER.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["admin", "customer", "guest"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred!" });
  }
};





// forgot password ftn
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found." });
    }

    // Generate reset token and hash it
    const resetToken =  user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    const message = `You have requested to reset your password. Please use the link below \n\n ${resetUrl} \n\n This link will expire in 10 minutes.`;

    // Send email
    try {
      await Mailer({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, message: "Password reset email sent successfully." });
    } catch (error) {
      // Clear reset fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      await user.save({validateBeforeSave:false});
      return res.status(500).json({ success: false, message: "Email could not be sent.Please try again later" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};



  const resetPassword = async (req, res) => {
    try {
      // Extract token from request
      const resetToken = req.params.token
      // Hash the token for database lookup
      const token = crypto.createHash("sha256").update(resetToken).digest("hex")
  
      // Find user by hashed token and check expiration
      const user = await USER.findOne({
        resetPasswordToken:token,
        resetPasswordTokenExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token.",
        });
      }
  
      // Reset password logic here
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (error) {
      console.error("Error resetting password:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  };
  

module.exports = { registration, login, getUserName , getUserDetails,updateUserRole,forgotPassword,resetPassword};