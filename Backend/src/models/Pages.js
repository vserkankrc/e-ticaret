// models/Pages.js
import { Schema, model } from "mongoose";

const PagesSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true, // URL için benzersiz slug (örneğin: "terms-of-use", "privacy-policy")
  },
  title: {
    type: String,
    required: true, // sayfa başlığı
  },
  content: {
    type: String,
    required: true, // sayfa içeriği (HTML veya markdown formatında olabilir)
  },
}, {
  timestamps: true, // createdAt, updatedAt otomatik eklenir
});

export default model("Pages", PagesSchema);
