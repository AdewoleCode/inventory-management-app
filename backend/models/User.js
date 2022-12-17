const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    maxlength: 40,
    minlength: 4,
  },
  email: {
    type: String,
    required: [true, "please provide name"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: [6, "password length must be more than 6 characters"],
  },
  photo: {
    type: String,
    required: [true, "please provide name"],
    default: "https://i.ibb.co/4pDNDk1/avatar.png",
  },
  phone: {
    type: String,
    default: "+234",
  },
  bio: {
    type: String,
    default: "bio",
    maxlength: [250, 'bio cannot be more than 250 characters long']
  },
},{timestamps: true});

userSchema.pre("save", async function (next) {

  if(!this.isModified('password')){
    return next()
  }


  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// userSchema.methods.createJwt = function () {
//     return jwt.sign({userId:this._id, name:this.name}, 'jwtSecret', {expiresIn: '30d'})
// }

module.exports = mongoose.model("User", userSchema);
