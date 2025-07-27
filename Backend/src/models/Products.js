import mongoose from "mongoose";

// İnceleme şeması
const ReviewSchema = mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Ürün şeması
const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: false },
    price: { type: Number, required: false },
    quantity: { type: Number, required: false, min: 0 }, // 🔥 Yeni eklendi: Stok adedi
    images: [{ type: String, required: false }],
    reviews: [ReviewSchema],
    description: { type: String, required: false },
    discount: { type: Number, required: false },
    colors: [{ type: String, required: false }],
    sizes: [{ type: String, required: false }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
