
const express = require("express");

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

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

router.get(
    "/teacher-panel",
    authMiddleware,
    roleMiddleware("teacher"),
    (req, res) => {
        return res.status(200).json({
            status: "success",
            message: "به پنل معلم خوش آمدید!",
            user: req.user
        });
    }
);

router.get(
    "/founder-panel",
    authMiddleware,
    roleMiddleware("founder"),
    (req, res) => {
        return res.status(200).json({
            status: "success",
            message: "به پنل مدیریت بنیان‌گذار خوش آمدید!",
            user: req.user
        });
    }
);

// get users list
router.get(
    "/",
    authMiddleware,
    roleMiddleware("founder"),
    async (req, res) => {
        try {
            const sql = `
                SELECT id, name, email, role, created_at
                FROM users
                ORDER BY created_at DESC
            `;

            const [users] = await db.query(sql);

            return res.status(200).json({
                status: "success",
                message: "فهرست کاربران با موفقیت دریافت شد.",
                count: users.length,
                users
            });

        } catch (error) {
            console.error("Get users error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام دریافت فهرست کاربران رخ داد."
            });
        }
    }
);

// get user info
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("founder"),
    async (req, res) => {
        try {
            const userId = req.params.id;

            const sql = `
                SELECT id, name, email, role, created_at
                FROM users
                WHERE id = ?
            `;

            const [users] = await db.query(sql, [userId]);

            if (users.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "کاربر موردنظر پیدا نشد."
                });
            }

            return res.status(200).json({
                status: "success",
                message: "اطلاعات کاربر با موفقیت دریافت شد.",
                user: users[0]
            });

        } catch (error) {
            console.error("Get user error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام دریافت اطلاعات کاربر رخ داد."
            });
        }
    }
);

// Edit users
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("founder"),
    async (req, res) => {
        try {
            const userId = req.params.id;
            const name = req.body.name?.trim();
            const email = req.body.email?.trim();

            if (!name || !email) {
                return res.status(400).json({
                    status: "error",
                    message: "نام و ایمیل الزامی هستند!"
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: "error",
                    message: "لطفاً یک ایمیل معتبر وارد کنید!"
                });
            }

            const sql = `
                UPDATE users
                SET name = ?, email = ?
                WHERE id = ?
            `;

            const [result] = await db.query(sql, [
                name,
                email,
                userId
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "کاربر موردنظر پیدا نشد."
                });
            }

            return res.status(200).json({
                status: "success",
                message: "اطلاعات کاربر با موفقیت ویرایش شد."
            });

        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    status: "error",
                    message: "این ایمیل قبلاً توسط کاربر دیگری ثبت شده است."
                });
            }

            console.error("Update user error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام ویرایش اطلاعات کاربر رخ داد."
            });
        }
    }
);

// delete user
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("founder"),
    async (req, res) => {
        try {
            const userId = req.params.id;

            // do not let founder delete his account
            if (Number(userId) === Number(req.user.id)) {
                return res.status(403).json({
                    status: "error",
                    message: "شما اجازه حذف حساب کاربری خودتان را ندارید."
                });
            }

            // do not let delete last founder
            const [users] = await db.query(
                "SELECT role FROM users WHERE id = ?",
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "کاربر موردنظر پیدا نشد."
                });
            }

            if (users[0].role === "founder") {
                const [founders] = await db.query(
                    "SELECT COUNT(*) AS total FROM users WHERE role = 'founder'"
                );

                if (founders[0].total <= 1) {
                    return res.status(403).json({
                        status: "error",
                        message: "حذف آخرین حساب Founder مجاز نیست."
                    });
                }
            }

            const sql = "DELETE FROM users WHERE id = ?";

            const [result] = await db.query(sql, [userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "کاربر موردنظر پیدا نشد."
                });
            }

            return res.status(200).json({
                status: "success",
                message: "کاربر با موفقیت حذف شد."
            });

        } catch (error) {
            console.error("Delete user error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام حذف کاربر رخ داد."
            });
        }
    }
);

module.exports = router;
