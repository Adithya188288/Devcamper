const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require('./db');
const errorHandler = require("./middleware/errors");
const fileUpload = require("express-fileupload");
const path = require("path");

/* require all middleware */

/*  Load the envionment variables */
dotenv.config({ path: "./config/config.env", debug: true });

const app = express();

/* use middleware */
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload());
app.use(express.json());


connectDB();

var bootcampRouter = require("./routes/bootcamps");
var courseRouter = require("./routes/courses");
var authRouter = require("./routes/auth");



app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, () => console.log(`Server started in ${process.env.NODE_ENV} mode and the port is ${PORT}`.yellow));

/* Handling UnhandledRejection */
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.bgRed);
    server.close(() => process.exit(1));
});