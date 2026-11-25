
const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT
                courses.id,
                courses.title,
                courses.description,
                courses.price,
                courses.thumbnail,
                courses.teacher_id,
                users.name AS teacher_name,
                courses.created_at
            FROM courses
            INNER JOIN users
                ON courses.teacher_id = users.id
            ORDER BY courses.created_at DESC
        `;

        const [courses] = await db.query(sql);

        return res.status(200).json({
            status: "success",
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error("Get courses error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "خطایی هنگام دریافت دوره‌ها رخ داد."
        });
    }
});

router.post(
    "/",
    authMiddleware,
    roleMiddleware("teacher", "founder"),
    async (req, res) => {
        try {
            const title = req.body.title;
            const description = req.body.description;
            const price = req.body.price;
            const thumbnail = req.body.thumbnail;
            const teacherId = req.user.id;

            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    status: "error",
                    message: "عنوان دوره الزامی است."
                });
            }

            if (
                price === undefined ||
                price === null ||
                price === "" ||
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "قیمت دوره باید یک عدد معتبر و غیرمنفی باشد."
                });
            }

            if (
                description !== undefined &&
                description !== null &&
                typeof description !== "string"
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "توضیحات دوره باید متنی باشد."
                });
            }

            if (
                thumbnail !== undefined &&
                thumbnail !== null &&
                typeof thumbnail !== "string"
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "آدرس تصویر دوره باید متنی باشد."
                });
            }

            const sql = `
                INSERT INTO courses
                (title, description, price, thumbnail, teacher_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                title.trim(),
                description?.trim() || null,
                Number(price),
                thumbnail?.trim() || null,
                teacherId
            ];

            const [result] = await db.query(sql, values);

            return res.status(201).json({
                status: "success",
                message: "دوره با موفقیت ایجاد شد.",
                course: {
                    id: result.insertId,
                    title: title.trim(),
                    description: description?.trim() || null,
                    price: Number(price),
                    thumbnail: thumbnail?.trim() || null,
                    teacher_id: teacherId
                }
            });
        } catch (error) {
            console.error("Create course error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام ایجاد دوره رخ داد."
            });
        }

    } 
    
);

router.get("/:id", async (req, res) => {
    try {
        const courseId = req.params.id;

        const sql = `
            SELECT
                courses.id,
                courses.title,
                courses.description,
                courses.price,
                courses.thumbnail,
                courses.teacher_id,
                users.name AS teacher_name,
                courses.created_at
            FROM courses
            INNER JOIN users
                ON courses.teacher_id = users.id
            WHERE courses.id = ?
        `;

        const [courses] = await db.query(sql, [courseId]);

        if (courses.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "دوره‌ای با این شناسه پیدا نشد."
            });
        }
        return res.status(200).json({
            status: "success",
            course: courses[0]
        });
    } catch (error) {
        console.error("Get course by ID error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "خطایی هنگام دریافت اطلاعات دوره رخ داد."
        });
    }
});

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher", "founder"),
    async (req, res) => {

        try {

            const courseId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            const sql = `
                SELECT id, teacher_id
                FROM courses
                WHERE id = ?
            `;

            const [courses] = await db.query(sql, [courseId]);

            if (courses.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "دوره‌ای با این شناسه پیدا نشد."
                });
            }

            if (
                userRole !== "founder" &&
                courses[0].teacher_id !== userId
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "شما اجازه ویرایش این دوره را ندارید."
                });
            }

            const title = req.body.title;
            const description = req.body.description;
            const price = req.body.price;
            const thumbnail = req.body.thumbnail;

            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    status: "error",
                    message: "عنوان دوره الزامی است."
                });
            }

            if (
                price === undefined ||
                price === null ||
                price === "" ||
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "قیمت دوره باید یک عدد معتبر و غیرمنفی باشد."
                });
            }

            if (
                description !== undefined &&
                description !== null &&
                typeof description !== "string"
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "توضیحات دوره باید متنی باشد."
                });
            }

            if (
                thumbnail !== undefined &&
                thumbnail !== null &&
                typeof thumbnail !== "string"
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "آدرس تصویر دوره باید متنی باشد."
                });
            }

            const cleanDescription =
                description === undefined || description === null
                    ? null
                    : description.trim();

            const cleanThumbnail =
                thumbnail === undefined || thumbnail === null
                    ? null
                    : thumbnail.trim();


            const updateSql = `
                UPDATE courses
                SET
                    title = ?,
                    description = ?,
                    price = ?,
                    thumbnail = ?
                WHERE id = ?
            `;

            const values = [
                title.trim(),
                cleanDescription,
                Number(price),
                cleanThumbnail,
                courseId
            ];

            console.log("Course ID:", courseId);

            console.log("Update values:", values);

            const [result] = await db.query(updateSql, values);

            console.log("Update result:", result);

            return res.status(200).json({
                status: "success",
                message: "دوره با موفقیت ویرایش شد."
            });

        } catch (error) {
            console.error("Update course error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام ویرایش دوره رخ داد."
            });
        }

    }
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher", "founder"),
    async (req, res) => {

        try {

            const courseId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            const sql = `
                SELECT id, teacher_id
                FROM courses
                WHERE id = ?
            `;

            const [courses] = await db.query(sql, [courseId]);

            if (courses.length === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "دوره‌ای با این شناسه پیدا نشد."
                });
            }

            if (
                userRole !== "founder" &&
                courses[0].teacher_id !== userId
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "شما اجازه حذف این دوره را ندارید."
                });
            }

            const deleteSql = `
                DELETE FROM courses
                WHERE id = ?
            `;

            const [result] = await db.query(deleteSql, [courseId]);

            return res.status(200).json({
                status: "success",
                message: "دوره با موفقیت حذف شد."
            });

        } catch (error) {
            console.error("Delete course error:", error.message);

            return res.status(500).json({
                status: "error",
                message: "خطایی هنگام حذف دوره رخ داد."
            });
        }
    }
);

module.exports = router;
