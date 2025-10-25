// /routes/adminAuth.js
import express from "express";
import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user || user.role !== "admin") {
    return res.status(401).json({ message: "E-mail veya şifre hatalı" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "E-mail veya şifre hatalı" });
  }

  const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    domain: process.env.NODE_ENV === "production" ? ".tercihsepetim.com" : undefined,
    path: "/",
    maxAge: 1000 * 60 * 60,
  });

  res.status(200).json({ user: { _id: user._id, email: user.email, role: user.role } });
});

export default router;
