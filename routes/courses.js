const express = require("express");
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");
var router = express.Router({mergeParams:true});

var { getAllCourses,getCourse, addCourse,updateCourse,deleteCourse } = require("../controllers/courses");

router.get("/", advancedResults(Course, {
    path: 'bootcamp',
    select: "name email phone website"
}), getAllCourses);
router.get("/:id",advancedResults(Course, {
    path: 'bootcamp',
    select: "name email phone website"
}), getCourse);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);




module.exports = router;
