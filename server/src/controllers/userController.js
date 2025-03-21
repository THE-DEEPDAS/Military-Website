const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Check register functionality
exports.checkRegister = (req, res) => {
  res.send("Register functionality is working");
};

// Check login functionality
exports.checkLogin = (req, res) => {
  res.send("Login functionality is working");
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, bio, skills, isPublic } = req.body;

  try {
    const user = await User.findById(req.user);
    if (user) {
      user.name = name || user.name;
      user.bio = bio || user.bio;
      user.skills = skills || user.skills;
      user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

      await user.save();
      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new skill
exports.addSkill = async (req, res) => {
  const { name, level } = req.body;

  try {
    const user = await User.findById(req.user);
    if (user) {
      user.skills.push({ name, level });
      await user.save();
      res.json(user.skills);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a skill
exports.removeSkill = async (req, res) => {
  const { skillId } = req.params;

  try {
    const user = await User.findById(req.user);
    if (user) {
      user.skills = user.skills.filter(
        (skill) => skill._id.toString() !== skillId
      );
      await user.save();
      res.json(user.skills);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search users by skill, location, proficiency, and availability
exports.searchUsers = async (req, res) => {
  const { skill, page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find({
      skills: { $elemMatch: { name: { $regex: skill, $options: "i" } } },
      isPublic: true, // Only search public profiles
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-password");

    const totalUsers = await User.countDocuments({
      skills: { $elemMatch: { name: { $regex: skill, $options: "i" } } },
      isPublic: true,
    });

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
