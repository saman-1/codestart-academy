
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "ابتدا باید وارد حساب کاربری شوید."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "error",
                message: "شما اجازه دسترسی به این بخش را ندارید."
            });
        }

        next();
    };
};

module.exports = roleMiddleware;
