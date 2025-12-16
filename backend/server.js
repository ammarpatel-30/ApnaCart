const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const LoginLog = require("./models/LoginLog");

const app = express();
app.use(express.json());
app.use(cors());

// ------------------ CONNECT MONGODB ------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/loginDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// ------------------ SIGNUP API ------------------
app.post("/api/signup", async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "Email already used!"
      });
    }

    // Hash password
    const hashPass = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      name,
      email,
      password: hashPass,
      address,
    });

    return res.json({
      success: true,
      message: "Signup successful!"
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Server error during signup"
    });
  }
});


// ------------------ LOGIN API ------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    let success = false;

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) success = true;
    }

    // Store login log
    await LoginLog.create({
      email,
      success,
    });

    if (success) {
      return res.json({
        success: true,
        message: "Login successful",
        user
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    return res.json({
      success: false,
      message: "Server error during login"
    });
  }
});


// ------------------ START SERVER ------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});