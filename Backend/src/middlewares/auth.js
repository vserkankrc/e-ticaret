import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Token'ı cookie'den veya header'dan al
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Token bulunamadı." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded içinde _id alanı var
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token geçersiz." });
  }
};


export default authMiddleware;
