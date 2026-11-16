
const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
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

    const userData = { name, email, password };

    res.json({
        status: "success",
        message: "User registration request received!",
    });
});

module.exports = router;
