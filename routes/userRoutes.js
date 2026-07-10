const express = require("express");
const router = express.Router();

const User = require("../models/User");
const jwt = require("jsonwebtoken");
// Create User

router.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});





// ======================
// Staff Login
// ======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Temporary password comparison
    // Replace with bcrypt.compare() after hashing passwords
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        staffId: user.staffId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        email:user.email,
        staffId: user.staffId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        department: user.department,
        designation: user.designation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Get All Users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});



// ======================
// Staff Logout
// ======================
router.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});



// ======================
// Get User by Staff ID
// ======================
router.get("/staff/:staffId", async (req, res) => {
    try {
        const user = await User.findOne({
            staffId: req.params.staffId,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// ======================
// Update User by Staff ID
// ======================
router.put("/staff/:staffId", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { staffId: req.params.staffId },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// ======================
// Delete User by Staff ID
// ======================
router.delete("/staff/:staffId", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            staffId: req.params.staffId,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;