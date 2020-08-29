const fs = require("fs");
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require("dotenv");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course")
const colors = require("colors");

dotenv.config({ path: "./config/config.env" });


var URI;

if (process.env.NODE_ENV === "development") {
    URI = process.env.MONGO_DB_URI_LOCAL;
} else {
    URI = process.env.MONGO_DB_URI_PROD;
}

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));


var importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        
        console.log("Data Imported...".green.inverse);
        process.exit();
    } catch (err) {
        console.log("Error ocuured while importing data".red.inverse);
        process.exit();
    }
};


var deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log("Data Cleared ".green.inverse);
        process.exit();
    } catch (err) {
        console.log("Error ocuured while deleting data".red.inverse);
        process.exit();
    }
};


if (process.argv[2] == "-i") {
    importData();
}

if (process.argv[2] == "-d") {
    deleteData();
}