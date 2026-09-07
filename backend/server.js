require("dotenv").config(); // make sure .env is in the project root

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const authRoutes=require('./routes/authRoutes')
const incomeRoutes=require('./routes/incomeRoutes')
const expenseRoutes=require('./routes/expenseRoutes')
const dashboardRoutes=require('./routes/dashboardRoutes')
const connectDB = require("./config/db");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "PUT", "POST", "DELETE"], // fixed typo
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// connect to MongoDB
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


//server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
