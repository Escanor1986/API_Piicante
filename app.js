const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const saucesRoutes = require("./routes/sauces.routes");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config({ path: "./config/.env" });

exports.app = app;

require("./config/auth");
require("./config/mongo.config");

const errorHandler = require("errorhandler");

// Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" }, // Adjust according to your needs
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Content",
      "X-Requested-With",
      "Origin",
    ],
    credentials: true, // Adjust if cookies are needed across origins
  })
);

// Parsing cookies
app.use(cookieParser());

// Parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// Error handling middleware
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      code: err.code || 500,
      message: err.message,
    });
  });
}

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = app;
