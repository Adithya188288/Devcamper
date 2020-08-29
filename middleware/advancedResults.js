const asyncHandler = require("./asyncHandler");


module.exports = (model, populate) => asyncHandler(async (req, res, next) => {
    
    let { query } = req;

    let reqQuery = { ...query };

    let removeFields = ["select", 'sort', 'page', 'limit'];

    removeFields.forEach(field => delete reqQuery[field]);

    if (req.params.id) {

        let modelIdExists = await model.findById(req.params.id).lean();

        if (!modelIdExists) {
            return next(new ErrorResponse(`No ${model.modelName} found with the Id ${req.params.id}`, 404));
        }

        reqQuery['_id'] = req.params.id;
    }


    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b('gt|gte|lt|lte|in')\b/, match => `$${match}`);


    queryStr = JSON.parse(queryStr);

    let results = model.find(queryStr).populate(populate);

    if (query.select) {
        let val = query.select.split(",").join(" ");
        results = results.select(val);
    }

    if (query.sort) {
        let val = query.sort.split(",").join(" ");
        results = results.sort(val);
    }


    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();


    results = results.skip(startIndex).limit(limit);

    results = await results;

    let pagination = {};

    console.log(startIndex, endIndex);

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    if (total <= limit) {
        res.advancedResults = { success: true, count: results.length, data: results };
    } else {
        res.advancedResults = { success: true, count: results.length, pagination, data: results };
    }

    next();
});