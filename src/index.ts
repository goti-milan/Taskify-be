// ================================
// Load env
// ================================
import "dotenv/config";

// ================================
// Imports
// ================================
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { PORT } from "./config";
import { initializeDatabase } from "./config/db";
import { authRoutes, taskRoutes } from "./routers";

// ================================
// App init
// ================================
const app = express();

// ================================
// 🚨 CORS — MVP MODE (ALLOW ALL)
// MUST BE FIRST
// ================================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicit preflight support (CRITICAL for Railway)
app.options("*", (_req, res) => {
  res.sendStatus(204);
});

// ================================
// Security (disable cross-origin blockers)
// ================================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ================================
// Body parsers
// ================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================================
// Rate limit (AFTER CORS)
// ================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// ================================
// Health check
// ================================
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, message: "Server running 🚀" });
});

// ================================
// Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ================================
// 404
// ================================
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

// ================================
// Global error handler
// ================================
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      },
    });
  }
);

// ================================
// Start server
// ================================
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
