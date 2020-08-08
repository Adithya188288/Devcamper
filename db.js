const mongoose = require("mongoose");
const e = require("express");
module.exports = async () => {
    var URI;

    if (process.env.NODE_ENV === "development") {
        URI = process.env.MONGO_DB_URI_LOCAL;
    } else {
        URI = process.env.MONGO_DB_URI_PROD;
    }

    try {

        mongoose.connection.on('connected', () => console.log(`Mongodb is now connected to ${mongoose.connection.host}`.cyan.underline));

        mongoose.connection.on('disconnecting', () => console.log("Mongodb is disconnecting..."));

        mongoose.connection.on('disconnected', () => console.log("Mongodb is disconnected"));

        process.on("SIGINT", () => {
            mongoose.connection.close(() => console.log(`Mongodb connection is closed`));
            process.exit(1);
        });


        mongoose.connection.on('open', () => console.log("Mongodb connection is now open"));

        mongoose.connection.on('error', () => console.log("An Error has occured in mongodb"));

        mongoose.connection.on('reconnected', () => console.log("Mongodb is reconnected"));


        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        }, (err) => {
            if (err) {
                throw err;
            }
        });

    }
    catch (err) {
        console.log(err);
    }
};