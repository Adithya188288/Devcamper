const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

let { register, login,getMe, forgotPassword, resetPassword } = require("../controllers/auth");


router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)


module.exports = router;