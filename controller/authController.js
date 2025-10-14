import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendEmailVerification, sendPasswordResetEmail } from "../mailTrap/email.js";
import { User } from "../models/userModels.js";

export const Signup = async (req, res) => {
  const { email, password, name, Identity, phoneNo } = req.body;
  try {
    if (!email || !password || !name || !Identity || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const varificationToken = Math.floor(100000 + Math.random() * 1000000).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      Identity,
      phoneNo,
      lastlogin: Date.now(),
      varificationToken,
      varificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    generateToken(res, newUser._id);
   
    await sendEmailVerification(newUser.email, varificationToken);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordVerified = await bcrypt.compare(password, userExists.password);
    if (!isPasswordVerified) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(res, userExists._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        Identity: userExists.Identity,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      varificationToken: code,
      varificationTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.isVerified = true;
    user.varificationToken = undefined;
    user.varificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.user).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(30).toString("hex");
    const resetTokenExpire = Date.now() + 60 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpire;
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const {token}=req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleLogin = async (req, res) => {
  if (!req.user) return res.status(400).json({ message: "Google authentication failed" });

  generateToken(res, req.user._id);

  res.status(200).json({
    message: "Login with Google successful",
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      googleId: req.user.googleId,
    },
  });
};