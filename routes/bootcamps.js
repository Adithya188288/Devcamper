const express = require("express");
const { protect } = require("../middleware/protect");
const { authorizeRoles } = require("../middleware/roles");
const validateIfUserAndModelAreRelated = require("../middleware/validateIfUserAndModelAreRelated");


var router = express.Router();

const courseRouter = require("../routes/courses");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

router.use("/:bootcampId/courses", courseRouter)

var { getAllBootcamps, getBootcamp, addBootcamp, updateBootcamp, deleteBootcamp, uploadBootcampPhoto } = require("../controllers/bootcamps");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/",advancedResults(Bootcamp, 'courses'), getAllBootcamps);
router.get("/:id",advancedResults(Bootcamp, 'courses') ,getBootcamp);
router.post("/", protect, authorizeRoles("publisher", "admin"), addBootcamp);
router.put("/:id", protect, authorizeRoles("publisher", "admin"), validateIfUserAndModelAreRelated, updateBootcamp);
router.delete("/:id",protect, authorizeRoles("publisher", "admin"),deleteBootcamp);
router.put("/:id/photo",protect, authorizeRoles("publisher", "admin"), uploadBootcampPhoto);


module.exports = router;
