
const db = require("./config/db");
const express = require("express");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const courseRoutes = require("./routes/courseRoutes");

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}

const app = express();

// db.query("SELECT 1")
//     .then(() => {
//         console.log("MySQL connected successfully!");
//     })
//     .catch((err) => {
//         console.error("Database connection failed:", err.message);
//     });

const startServer = async () => {
    try {
        await db.query("SELECT 1");

        console.log("MySQL connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);

    next();
});

app.use("/api", healthRoutes);
app.use("/api/users", userRoutes);

app.use("/api/courses", courseRoutes);

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to CodeStart Academy - Version 2!");
});

// app.get("/api/health", (req, res) => {
//     res.json({
//         status: "success",
//         message: "CodeStart Academy Backend is running!",
//         timestamp: new Date()
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
