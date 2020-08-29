const express = require("express");
var router = express.Router();

const courseRouter = require("../routes/courses");

router.use("/:bootcampId/courses", courseRouter)

var { getAllBootcamps, getBootcamp, addBootcamp, updateBootcamp, deleteBootcamp, uploadBootcampPhoto } = require("../controllers/bootcamps");

router.get("/", getAllBootcamps);
router.get("/:id", getBootcamp);
router.post("/", addBootcamp);
router.put("/:id", updateBootcamp);
router.delete("/:id", deleteBootcamp);
router.put("/:id/photo", uploadBootcampPhoto);


module.exports = router;
