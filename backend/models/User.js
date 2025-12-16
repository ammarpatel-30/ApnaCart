const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: String,
    role: {
        type: String,
        enum: ["user", "admin"], // only "user" or "admin"
        default: "user"
    }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model("User", UserSchema);