// Backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Cookie'den veya Authorization header'dan token al
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Token bulunamadı." });
    }

    // Token doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user içine user bilgilerini ekle
    req.user = decoded; // decoded içinde _id, email, role vs. olabilir
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Token geçersiz." });
  }
};

export default authMiddleware;
