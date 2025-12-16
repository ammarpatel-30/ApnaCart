const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema({
    email: String,
    success: Boolean,  // true if login successful, false if failed
},{timestamp: true});

module.exports = mongoose.model("LoginLog", LoginLogSchema);