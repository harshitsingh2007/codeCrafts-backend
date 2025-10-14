import express from "express";
import passport from "../middleware/passport.js";
import {
  Signup,
  Login,
  logout,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout",logout);
router.post("/verify-email", verifyEmail);
router.get("/check-auth", verifyToken, checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signup" }),
  (req, res) => {
    res.redirect("http://localhost:3000"); 
  }
);

export default router;
