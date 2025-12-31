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
   ✅ CORS (NO WILDCARDS + NO HANG)
============================ */
const ALLOWED_ORIGINS = [
  "https://taskify-beta-seven.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ SAFE preflight handler (NO cors() here) */
app.options("*", (_req, res) => {
  res.sendStatus(204);
});

/* ============================
   Security (safe config)
============================ */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

/* ============================
   Body parsers
============================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ============================
   Rate limit (AFTER OPTIONS)
============================ */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

/* ============================
   Routes
============================ */
app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* ============================
   404
============================ */
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* ============================
   Error handler
============================ */
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
);

/* ============================
   Start server
============================ */
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup failed", err);
    process.exit(1);
  }
};

startServer();
