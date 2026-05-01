const express = require("express");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("URL Shortener API is running 🚀");
});

// Routes
app.use("/", urlRoutes);

// Start Server
app.listen(3000, () => {
  console.log(`Server running on http://localhost:${port}`);
});
