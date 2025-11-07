const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const userModel=require('../models/user');
const authController=require('../controller/authController');

router.post('/register',authController.registerUser);
router.post("/login", authController.loginUser)
router.get('/verify',authController.verifyUser);
router.get("/me", async (req, res) => {
  try {
    
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 

    // 3️⃣ Find user by ID
    const user = await userModel.findById(userId).select("fullName email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Send data to frontend
    res.status(200).json({
      fullName: `${user.fullName.firstName} ${user.fullName.lastName}`,
      email: user.email,
      
    });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports=router;