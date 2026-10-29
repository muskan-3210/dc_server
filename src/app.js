const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
