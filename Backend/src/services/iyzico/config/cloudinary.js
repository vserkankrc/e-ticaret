import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// .env dosyasının tam yolunu ver
dotenv.config({
  path: path.resolve("env/.dev"), // veya "backend/env/.dev" şeklinde olabilir
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key:', process.env.CLOUDINARY_API_KEY);
console.log('API secret:', process.env.CLOUDINARY_API_SECRET);

export default cloudinary;
