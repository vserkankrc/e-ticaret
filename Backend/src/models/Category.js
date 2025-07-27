import mongoose from "mongoose";
import nanoid from "../utils/nanoid.js";


const CategorySchema = new mongoose.Schema(
  {
    uid:{ type: String, default: nanoid(), required: true, unique: true },
    name: { type: String, required: true,unique: true  },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;
