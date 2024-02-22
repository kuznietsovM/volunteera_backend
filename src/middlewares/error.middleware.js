const ApiError = require('../exceptions/api.error');

module.exports = (err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError) {

        if (err.message == "INVALID_ACTIVATION_LINK"){
            res.setHeader('Content-type','text/html')
            return res.status(500).send('<h1>Your activation link is not valid</h1>');
        }

        return res.status(err.status).json({
            error: err.errors,
            message: err.message
        });
    }
    return res.status(500).json({
        message: "INTERNAL_SERVER_ERROR"
    });
}