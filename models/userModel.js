import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullname: {type: String, require: true},
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true, minlength: 6},
  gender: {type: String, require: true, enum: ["male", "female"]},
  profilePic: {type: String, default: ""}
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)