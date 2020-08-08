module.exports = asyncHandler = fn => (req, res, next) => {
    debugger;
    Promise
        .resolve(fn(req, res, next))
        .catch(next);
};
// module.exports = asyncHandler = fn => async (req, res, next) => {
//     try {
//         return await fn(req, res, next);
//     }
//     catch (err) {
//         next(err);
//     }
// };

