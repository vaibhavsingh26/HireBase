import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ message: "All fields are required", sucess: false });
        };
         console.log("✅ /register hit");
    console.log("📦 req.body:", req.body);
        console.log("POST /register hit");

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", sucess: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });
        return res.status(201).json({ message: "User registered successfully", sucess: true });
    } catch (error) {
        console.error("Error registering user:", error.message);
        console.error("📄 Stack Trace:", error.stack);

        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password", success: false });
    }

    if (role !== user.role) {
      return res.status(400).json({ message: "Role mismatch", success: false });

    }
    console.log("🧪 Signing JWT with secret:", "mySecretKey123");
console.log("🔐 Payload:", { id: user._id });


    const token = jwt.sign({ id: user._id }, "mySecretKey123", { expiresIn: "1d" });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Login successful", user, token, success: true });

  } catch (error) {
    console.log("error in login controller", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, samesite: 'strict' }).json({ message: "Logout successful", sucess: true });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let skillsArray;

    if (skills) {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }

    const userId = req.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = skillsArray;
    if (file) user.profile = file.filename;

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({ message: "Profile updated successfully", user, success: true });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

