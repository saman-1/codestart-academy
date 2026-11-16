
const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "CodeStart Academy Backend is running!",
        timestamp: new Date()
    });
});

module.exports = router;
