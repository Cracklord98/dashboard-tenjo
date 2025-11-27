import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getMetasData,
  getGlobalMetrics,
  getProgramPerformance,
  getEjePerformance,
  getFinancialSummary,
  reloadData,
} from "./controllers/dataController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.some((allowed) => origin?.includes(allowed))
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production, or customize as needed
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.url}`);
  console.log(`⏰ ${new Date().toLocaleString()}`);
  next();
});

// Routes
app.get("/api/metas", getMetasData);
app.get("/api/metrics/global", getGlobalMetrics);
app.get("/api/metrics/programs", getProgramPerformance);
app.get("/api/metrics/ejes", getEjePerformance);
app.get("/api/financial/summary", getFinancialSummary);
app.post("/api/reload", reloadData);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET /api/metas`);
  console.log(`   - GET /api/metrics/global`);
  console.log(`   - GET /api/metrics/programs`);
  console.log(`   - GET /api/metrics/ejes`);
  console.log(`   - GET /api/financial/summary`);
  console.log(`   - POST /api/reload`);
});
