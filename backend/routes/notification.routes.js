const express = require("express");
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyNotifications);
router.route("/unread-count").get(getUnreadCount);
router.route("/read-all").patch(markAllAsRead);
router.route("/:id/read").patch(markAsRead);

module.exports = router;
