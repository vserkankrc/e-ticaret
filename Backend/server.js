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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Frontend URL burada olmalı
    credentials: true,
  })
);
app.use(cookieParser());

// Passport JWT stratejisi
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

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
      if (user) return done(null, user.toJSON());
      else return done(new ApiError("User not found", 401, "NOT_FOUND"), false);
    } catch (error) {
      return done(error, false);
    }
  })
);

app.use(passport.initialize());

// --- API ROUTES ---
app.use("/api", mainRoute);
mainRoute.get("/", (req, res) => res.send("API Root"));

// JWT test endpoint
app.all("/test-auth", Session, (req, res) => {
  res.send("JWT ile doğrulama başarılı");
});

// --- FRONTEND SERVE (SADECE PROD İÇİN) ---
if (process.env.NODE_ENV === "production") {
  // Kullanıcı frontend (client/build)
  const clientPath = path.join(__dirname, "client/build");
  app.use(express.static(clientPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
  app.get("/shop/*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });

  // Admin frontend (admin-client/build)
  const adminPath = path.join(__dirname, "admin-client/build");
  app.use("/admin", express.static(adminPath));
  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(adminPath, "index.html"));
  });
}

// Hata handler
app.use(GenericErrorHandler);

// PORT ve host ayarları
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Dış erişim için 0.0.0.0 olmalı

// HTTPS kontrolü
if (process.env.HTTPS_ENABLED === "true") {
  const key = fs.readFileSync(path.join(__dirname, "./src/certs/key.pem")).toString();
  const cert = fs.readFileSync(path.join(__dirname, "./src/certs/cert.pem")).toString();

  connect();

  https
    .createServer({ key, cert }, app)
    .listen(PORT, HOST, () => {
      console.log(`🔐 HTTPS sunucu çalışıyor → https://${HOST}:${PORT}`);
    });
} else {
  app.listen(PORT, HOST, () => {
    connect();
    console.log(`🚀 Sunucu çalışıyor → http://${HOST}:${PORT}`);
  });
}
