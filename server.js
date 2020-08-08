const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require('./db');


/* require all middleware */

/*  Load the envionment variables */
dotenv.config({ path: "./config/config.env", debug: true });

const app = express();

/* use middleware */
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use(express.json());


connectDB();

var bootcampRouter = require("./routes/bootcamps");

app.use("/api/v1/bootcamps", bootcampRouter);


const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, () => console.log(`Server started in ${process.env.NODE_ENV} mode and the port is ${PORT}`.yellow));

/* Handling UnhandledRejection */
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.bgRed);
    server.close(() => process.exit(1));
});