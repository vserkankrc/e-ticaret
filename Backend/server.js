import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import config from "./src/config.js";
import logger from "morgan";
import mongoose from "mongoose";
import mainRoute from "./src/routes/index.js";
import https from "https";
import fs from "fs";
import path from "path";
import GenericErrorHandler from "./src/middlewares/GenericErrorHandler.js";
import ApiError from "./src/error/ApiError.js";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import Users from "./src/models/Users.js";
import Session from "./src/middlewares/Session.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// Environment dosyası
const envPath = config?.production ? "./env/.prod" : "./env/.dev";
dotenv.config({ path: envPath });

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware'ler
app.use("/assets", express.static(path.join(__dirname, "src/assets")));
app.use(express.json());
app.use(logger(process.env.LOGGER || "dev"));
app.use(helmet());

// İzin verilen frontend listesi
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://192.168.1.106",
  "http://192.168.1.106:5173",
  "http://192.168.1.106:5174",
  "http://192.168.1.106:3000",
  "https://192.168.1.106",
  "https://192.168.1.106:3000",
  "https://192.168.1.106:443",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Bu origin izinli değil. → " + origin));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Passport JWT stratejisi
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

const JwtOpts = {
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.cookies?.token) {
      token = req.cookies.token;
      if (token.startsWith("Bearer ")) token = token.split(" ")[1];
    }
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(JwtOpts, async (jwtPayload, done) => {
    try {
      const user = await Users.findById(jwtPayload._id);
      if (user) return done(null, user.toJSON());
      else return done(new ApiError("User not found", 401, "NOT_FOUND"), false);
    } catch (error) {
      return done(error, false);
    }
  })
);

app.use(passport.initialize());

// Routes
app.use("/api", mainRoute);
mainRoute.get("/", (req, res) => res.send("API Root"));

// 🔹 FRONTEND SERVE - Yapı bozulmadan güncellendi
const frontendDistPath = path.join(__dirname, "../frontend/dist");

// Admin paneli
app.use("/admin", express.static(frontendDistPath));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Genel React sayfaları
app.use(express.static(frontendDistPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// JWT test endpoint
app.all("/test-auth", Session, (req, res) => {
  res.send("JWT ile doğrulama başarılı");
});

// Hata handler
app.use(GenericErrorHandler);

// PORT ve host ayarları
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// HTTPS kontrolü
if (process.env.HTTPS_ENABLED === "true") {
  const key = fs.readFileSync(path.join(__dirname, "./src/certs/key.pem")).toString();
  const cert = fs.readFileSync(path.join(__dirname, "./src/certs/cert.pem")).toString();

  connect();

  https.createServer({ key, cert }, app).listen(PORT, HOST, () => {
    console.log(`🔐 HTTPS sunucu çalışıyor → https://${HOST}:${PORT}`);
  });
} else {
  app.listen(PORT, HOST, () => {
    connect();
    console.log(`🚀 Sunucu çalışıyor → http://${HOST}:${PORT}`);
  });
}
