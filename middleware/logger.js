/*
@desc  fucntion to logs all request coming to this API
*/
module.exports = (req, res, next) => {
    console.log(`${req.method} - ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};