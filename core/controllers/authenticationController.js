const customer = require("../Structures/UserSideModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
    const { Username, Email, Password, Role, adminCode } = req.body;
    console.log("📥 Incoming Register Request:", req.body); // DEBUG
  
    try {
      if (Role === "Admin" && adminCode !== "ZITHARA_ADMIN_2025") {
        console.log("❌ Invalid admin code"); // DEBUG
        return res.status(403).json({ message: "Invalid Admin Code" });
      }
  
      const existingUser = await customer.findOne({ Email });
      if (existingUser) {
        console.log("⚠️ User already exists"); // DEBUG
        return res.status(400).json({ message: "User already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(Password, 10);
      const newUser = new customer({
        Username,
        Email,
        Password: hashedPassword,
        Role,
      });
  
      await newUser.save();
      console.log("✅ User registered successfully"); // DEBUG
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("🔥 Registration error:", err); // DEBUG
      res.status(500).json({
        message: "Something went wrong while registering",
        error: err.message,
      });
    }
  };
  
// 🔐 Login Controller
const Login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await customer.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.Role },
      process.env.JWT_S,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token, 
      role: user.Role,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

module.exports = { Register, Login };
