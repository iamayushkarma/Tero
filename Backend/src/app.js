import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.send("running");
});

// Basic configurations
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("public"));

// CORS configurations
const allowedOrigins = ["http://localhost:5173", "http://192.168.1.3:5173"];

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
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

// Import route
import healthCheckRouter from "./routes/healthcheck.route.js";
import resumeRouter from "./routes/resume.route.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/resume", resumeRouter);

export default app;
