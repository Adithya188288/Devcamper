const express = require("express");
var router = express.Router();

const courseRouter = require("../routes/courses");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

router.use("/:bootcampId/courses", courseRouter)

var { getAllBootcamps, getBootcamp, addBootcamp, updateBootcamp, deleteBootcamp, uploadBootcampPhoto } = require("../controllers/bootcamps");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/",advancedResults(Bootcamp, 'courses'), getAllBootcamps);
router.get("/:id",advancedResults(Bootcamp, 'courses') ,getBootcamp);
router.post("/", addBootcamp);
router.put("/:id", updateBootcamp);
router.delete("/:id", deleteBootcamp);
router.put("/:id/photo", uploadBootcampPhoto);


module.exports = router;
