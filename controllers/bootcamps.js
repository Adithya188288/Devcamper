/* 
@desc    Get all Bootcamps
@route   GET /api/v1/bootcamps/
@access  Public
*/
module.exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Showing all Bootcamps" });
};

/* 
@desc    Get a Bootcamp with the appropiate Id
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
module.exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Showing the Bootcamp with the id of the ${req.params.id}` });
};

/* 
@desc    Get a new Bootcamp
@route   POST /api/v1/bootcamps/
@access  Private
*/
module.exports.addBootcamp = (req, res, next) => {
    res.status(201).json({ success: true, msg: "Added a bootcamp" });
};


/* 
@desc    Update a bootcamp with the appropiate Id
@route   PUT /api/v1/bootcamps/:id
@access  Private
*/
module.exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Updated a bootcamp with Id of ${req.params.id}` });
};

/* 
@desc    Delete a bootcamp with the appropiate Id
@route   DELETE /api/v1/bootcamps/:id
@access  Public
*/
module.exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Deleted a bootcamp with Id of ${req.params.id}` });
};