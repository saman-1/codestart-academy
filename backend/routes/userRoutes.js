
const express = require("express");

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    
    try {

        const name = req.body.name?.trim();
        const email = req.body.email?.trim();
        const password = req.body.password;

        // empty fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "تمام فیلدها الزامی هستند!"
            });
        }

        // email checker
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "لطفاً یک ایمیل معتبر وارد کنید!"
            });
        }

        // password checker
        if (password.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "رمز عبور باید حداقل ۸ کاراکتر باشد!"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        const [result] = await db.query(sql, [name, email, hashedPassword]);

        return res.status(201).json({
            status: "success",
            message: "ثبت‌نام با موفقیت انجام شد!",
            user: {
                id: result.insertId,
                name,
                email,
                role: "student"
            }
        });

    } catch (error) {

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "error",
                message: "این ایمیل قبلاً ثبت‌نام شده است!"
            });
        }
        
        console.error("Registration error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "خطایی هنگام ثبت‌نام رخ داد."
        });
    }

});

router.post("/login", async (req, res) => {

    try {

        const email = req.body.email?.trim();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "ایمیل و رمز عبور الزامی هستند!"
            });
        }

        const sql = "SELECT * FROM users WHERE email = ?";
        const [users] = await db.query(sql, [email]);

        if (users.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "ایمیل یا رمز عبور اشتباه است!"
            });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "ایمیل یا رمز عبور اشتباه است!"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            status: "success",
            message: "ورود با موفقیت انجام شد!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "خطایی هنگام ورود رخ داد."
        });
    }

});

router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "شما با موفقیت احراز هویت شدید!",
        user: req.user
    });
});

module.exports = router;
