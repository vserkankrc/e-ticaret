import express from "express";
import categoryRoute from "./categories.js";
import productRoute from "./products.js";
import authRoute from "./auth.js";
import testRoute from "./test.js";
import couponRoute from "./coupons.js";
import resetRoute from "./reset.js";
import userRoute from "./users.js";
import favoriteRoutes from "./favorite.js";
import mailRoute from "./mail.js";
import orderRoute from "./orders.js"; // ✅ yeni eklenen satır
import reviewsRoute from "./reviews.js";
import pagesRoute from "./pages.js";  // yeni eklenen satır
import productQuestionsRoute from "./productQuestions.js";


const router = express.Router();

router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/auth", authRoute);
router.use("/check", testRoute);
router.use("/coupons", couponRoute);
router.use("/forgot", resetRoute);
router.use("/users", userRoute);
router.use("/favorites", favoriteRoutes);
router.use("/mail", mailRoute);
router.use("/orders", orderRoute); // ✅ sipariş endpoint'i eklendi
router.use("/reviews",reviewsRoute)
router.use("/pages", pagesRoute);  // yeni eklenen satır
router.use("/questions", productQuestionsRoute);
export default router;




