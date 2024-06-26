function validateRequest(schema) {
    return async (req, res, next) => {
        try {
            const validationRes = await schema.validateAsync(req.body, { abortEarly: false })
            console.log('from the validator', validationRes);
            if (validationRes.user) req.user = validationRes.user;


            next();
        } catch (error) {
            // const errorMessage = error.details.map(d => d.message).join(', ');
            next(error);

        }
    };
}

module.exports = validateRequest;