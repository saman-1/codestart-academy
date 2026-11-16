
const db = require("./config/db");
const express = require("express");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

db.query("SELECT 1")
    .then(() => {
        console.log("MySQL connected successfully!");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    next();
});

app.use("/api", healthRoutes);
app.use("/api/users", userRoutes);

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to CodeStart Academy - Version 2!");
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "CodeStart Academy Backend is running!",
        timestamp: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
