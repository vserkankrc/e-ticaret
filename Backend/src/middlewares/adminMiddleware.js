import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  // Token'ı cookie'den veya header'dan al
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.status(401).json({ message: "Token bulunamadı." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcının admin olup olmadığını kontrol et
    if (decoded.role === "admin") {
      req.user = decoded; // kullanıcı bilgilerini request objesine ekle
      return next();
    } else {
      return res.status(403).json({ message: "Admin yetkisi gerekli." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token geçersiz." });
  }
};

export default adminMiddleware;
