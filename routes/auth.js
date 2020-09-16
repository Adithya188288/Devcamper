const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

let { register, login,getMe, forgotPassword, resetPassword, updateUserDetails, updatePassword } = require("../controllers/auth");


router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)
router.put("/updateuserdetails", protect, updateUserDetails)
router.put("/updatepassword", protect, updatePassword)



module.exports = router;