const Bootcamp = require("../models/Bootcamp");

/* 
@desc    Get all Bootcamps
@route   GET /api/v1/bootcamps/
@access  Public
*/
module.exports.getAllBootcamps = async (req, res, next) => {
    try {
        let bootcamps = await Bootcamp.find().lean();
        return res.status(200).json({ success: true, data: bootcamps });
    } catch (error) {
        return res.status(400).json({ success: false, });
    }
};

/* 
@desc    Get a Bootcamp with the appropiate Id
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
module.exports.getBootcamp = async (req, res, next) => {
    try {
        let bootcamp = await Bootcamp.findById(req.params.id).lean();
        return res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        return res.status(400).json({ success: false, });
    }
};

/* 
@desc    Get a new Bootcamp
@route   POST /api/v1/bootcamps/
@access  Private
*/
module.exports.addBootcamp = async (req, res, next) => {
    try {
        let bootcamp = await Bootcamp.create(req.body);
        return res.status(201).json({ success: true, data: bootcamp });
    }
    catch (err) {
        return res.status(400).json({ success: false, });
    }
};


/* 
@desc    Update a bootcamp with the appropiate Id
@route   PUT /api/v1/bootcamps/:id
@access  Private
*/
module.exports.updateBootcamp = async (req, res, next) => {

    try {
        let bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, { new: true, runValidator: true });
        if (!bootcamp) {
            throw "No Bootcamp with this Id Available";
        }
        return res.status(200).json({ success: true, data: bootcamp });

    }
    catch (err) {
        return res.status(400).json({ success: false, error: err });
    }

};

/* 
@desc    Delete a bootcamp with the appropiate Id
@route   DELETE /api/v1/bootcamps/:id
@access  Public
*/
module.exports.deleteBootcamp = async (req, res, next) => {
    try {
        await Bootcamp.findOneAndDelete(req.params.id);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        return res.status(400).json({ success: false });
    }
};