const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");
const { protect } = require("../middleware/protect");
const { authorizeRoles } = require("../middleware/roles");
const validateIfUserAndModelAreRelated = require("../middleware/validateIfUserAndModelAreRelated");

var {getAllUsers, getUser, updateUser, deleteUser, createUser } = require("../controllers/users");

router.get("/", protect, authorizeRoles("admin"), advancedResults(User), getAllUsers);

router.get("/:id",protect, authorizeRoles("admin"), getUser);

router.post("/", protect, authorizeRoles("admin"),createUser);
router.put("/:id", protect, authorizeRoles("admin"),updateUser);
router.delete("/:id",protect, authorizeRoles("admin"), deleteUser);




module.exports = router;
