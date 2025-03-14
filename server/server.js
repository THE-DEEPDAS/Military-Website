const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");
const skillExchangeRoutes = require("./src/routes/skillExchangeRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const notificationAlertRoutes = require("./src/routes/notificationAlertRoutes");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Middleware to log the route being hit and the response
app.use((req, res, next) => {
  console.log(`Route: ${req.method} ${req.url}`);
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response: ${body}`);
    originalSend.call(this, body);
  };
  next();
});

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Deep shabash your API is running");
});

/******* Routes ******/
app.use("/api/users", userRoutes);
app.use("/api/skill-exchanges", skillExchangeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notification-alerts", notificationAlertRoutes);

// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Server error. Please try again later.",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
