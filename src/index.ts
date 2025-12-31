// src/index.ts
import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { PORT } from "./config";
import { initializeDatabase } from "./config/db";
import { authRoutes, taskRoutes } from "./routers";

const app = express();

/* ============================
   ✅ Allowed origins for CORS
============================ */
const ALLOWED_ORIGINS = [
  "https://taskify-beta-seven.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

/* ============================
   ✅ Global CORS Middleware
   Handles preflight OPTIONS automatically
============================ */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================
   ✅ Optional explicit OPTIONS handler
   (safe fallback, avoids path-to-regexp issues)
============================ */
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

/* ============================
   ✅ Security (Helmet)
============================ */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

/* ============================
   ✅ Body parsers
============================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================
   ✅ Rate limiter
============================ */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP
});
app.use("/api", limiter);

/* ============================
   ✅ Routes
============================ */
app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* ============================
   ✅ 404 handler
============================ */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

/* ============================
   ✅ Error handler
============================ */
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
);

/* ============================
   ✅ Start server
============================ */
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup failed", err);
    process.exit(1);
  }
};

startServer();
