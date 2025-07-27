import mongoose from "mongoose";

const productQuestionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: "", // Başlangıçta boş olabilir, satıcı sonradan cevaplayacak
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt otomatik eklenecek
  }
);

const ProductQuestion = mongoose.model("ProductQuestion", productQuestionSchema);

export default ProductQuestion;
