// middlewares/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Geçici yükleme klasörü (Cloudinary'ye göndermeden önce)
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ./uploads/ klasörüne kaydeder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // dosya uzantısını alır
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;
