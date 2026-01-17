import express from "express";
import rateLimit from "express-rate-limit"; // Change to import
import cors from "cors";
import tokenManager from "./utils/tokenManager.js"; // Add this

const app = express();

// Rate limiter for token generation
const tokenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 tokens per minute
  message: {
    success: false,
    error: "Too many token requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for resume analysis
const resumeAnalysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Allow 3 requests per windowMs
  message: {
    success: false,
    error: "You have analyzed too many resumes. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/", (req, res) => {
  res.send("running");
});

// Basic configurations
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("public"));

// CORS configurations
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.3:5173",
  "http://192.168.1.2:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"], // Add token header
  }),
);

// Token generation endpoint
app.get("/api/v1/token", tokenLimiter, (req, res) => {
  const token = tokenManager.generateToken();
  res.json({
    success: true,
    token,
    expiresIn: 300000, // 5 minutes in ms
  });
});

// Import routes
import healthCheckRouter from "./routes/healthcheck.route.js";
import resumeRouter from "./routes/resume.route.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/resume", resumeAnalysisLimiter, resumeRouter);

export default app;
