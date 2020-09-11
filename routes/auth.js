const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

let { register, login,getMe } = require("../controllers/auth");


router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe)



module.exports = router;