const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  userName:{
                type:String,
                required:true,
                unique:[true, 'Username already in use']
    
            },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    default: "customer",
    enum: ["admin", "customer"],
  },
  phone: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpires: { type: Date },
});



// password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// password comparison
userSchema.methods.comparePassword = async function (userPassword) {
  const isCorrect = await bcrypt.compare(userPassword, this.password);
  return isCorrect;
};


// generate jwt token
userSchema.methods.generateToken = async function (params){
  const token = jwt.sign({userId:this._id, userName:this.userName},process.env.JWT_SECRET);
  return token;
}

// generating reset password token
userSchema.methods.getResetPasswordToken = function () {
const resetToken = crypto.randomBytes(20).toString("hex");
this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
this.resetPasswordTokenExpires = Date.now() + 2 * 60 * 60 * 1000;
console.log(resetToken , this.resetPasswordToken );
return resetToken;
};



const USER = mongoose.model("User", userSchema);
module.exports = USER;
