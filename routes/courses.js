const express = require("express");
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");
const { protect } = require("../middleware/protect");
const { authorizeRoles } = require("../middleware/roles");
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

router.post("/", protect, authorizeRoles("publisher", "admin"), addCourse);
router.put("/:id", protect, authorizeRoles("publisher", "admin"),updateCourse);
router.delete("/:id",protect, authorizeRoles("publisher", "admin"), deleteCourse);




module.exports = router;
