
const express = require("express");

const db = require("../config/db");
const bcrypt = require("bcrypt");

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

module.exports = router;
