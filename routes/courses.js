const express = require("express");
var router = express.Router({mergeParams:true});

var { getAllCourses,getCourse, addCourse,updateCourse,deleteCourse } = require("../controllers/courses");

router.get("/", getAllCourses);
router.get("/:id", getCourse);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);




module.exports = router;
