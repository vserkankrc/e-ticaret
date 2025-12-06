import mongoose from "mongoose";
import nanoid from "../utils/nanoid.js";

const { Schema } = mongoose;

// Adres şeması
const addressSchema = new Schema(
  {
    label: { type: String, default: "" },
    address: { type: String, default: "" },
    province: { type: String, default: "" },
    district: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "Türkiye" },
  },
  { _id: false }
);

const UsersSchema = new Schema(
  {
    uid: {
      type: String,
      default: () => nanoid(),
      required: true,
      unique: true,
    },

    name: { type: String, required: true },
    surname: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: function () {
        return !this.isOAuthUser;
      },
    },

    phoneNumber: { type: String, required: true, unique: true },

    gender: {
      type: String,
      enum: ["Erkek", "Kadın", "Diğer"],
      default: null,
    },

    tcIdentityNumber: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || /^\d{11}$/.test(v);
        },
        message: "T.C. Kimlik numarası 11 haneli olmalıdır.",
      },
    },

    billingType: {
      type: String,
      enum: ["bireysel", "kurumsal"],
      default: "bireysel",
    },

    companyName: { type: String, default: null },
    taxNumber: { type: String, default: null },
    taxOffice: { type: String, default: null },

    personalAddress: {
      type: addressSchema,
      default: null,
    },

    billingAddress: {
      type: addressSchema,
      default: null,
    },

    shippingAddress: {
      type: addressSchema,
      default: null,
    },

    ip: {
      type: String,
      required: true,
      default: "85.34.78.112",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },

    // Google OAuth alanları
    googleId: { type: String, unique: true, sparse: true, default: null }, // Düzeltilmiş
    avatar: { type: String, default: null },
    isOAuthUser: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", UsersSchema);
export default Users;
