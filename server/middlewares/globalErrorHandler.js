
module.exports = async (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Problemi!';
    res.status(status).json({
        error: {
            status,
            message,
        },
    });
};