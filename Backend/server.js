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
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import Users from "./src/models/Users.js";
import Session from "./src/middlewares/Session.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// ✅ Environment dosyası düzgün yükleniyor mu kontrolü:
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

// Statik dosyalar için assets klasörü (logo, resim vs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware'ler
app.use("/assets", express.static(path.join(__dirname, "src/assets")));
app.use(express.json());
app.use(logger(process.env.LOGGER || "dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Render için güncellendi
    credentials: true,
  })
);
app.use(cookieParser());

// ✅ Passport JWT stratejisi
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

const JwtOpts = {
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.cookies?.token) {
      token = req.cookies.token;
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
    }
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(JwtOpts, async (jwtPayload, done) => {
    try {
      const user = await Users.findById(jwtPayload._id);
      if (user) {
        return done(null, user.toJSON());
      } else {
        return done(new ApiError("User not found", 401, "NOT_FOUND"), false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

app.use(passport.initialize());

// ✅ Routes
app.use("/api", mainRoute);
mainRoute.get("/", (req, res) => {
  res.send("API Root");
});

// JWT test
app.all("/test-auth", Session, (req, res) => {
  res.send("JWT ile doğrulama başarılı");
});

// ✅ Hatalar
app.use(GenericErrorHandler);

// ✅ HTTPS kontrolü
const PORT = process.env.PORT || 3000;

if (process.env.HTTPS_ENABLED === "true") {
  const key = fs.readFileSync(path.join(__dirname, "./src/certs/key.pem")).toString();
  const cert = fs.readFileSync(path.join(__dirname, "./src/certs/cert.pem")).toString();

  connect();

  https
    .createServer({ key, cert }, app)
    .listen(PORT, "0.0.0.0", () => {
      console.log(`🔐 HTTPS sunucu çalışıyor → https://0.0.0.0:${PORT}`);
    });
} else {
  app.listen(PORT, "0.0.0.0", () => {
    connect();
    console.log(`🚀 Sunucu çalışıyor → http://0.0.0.0:${PORT}`);
  });
}
