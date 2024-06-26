const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const { comparePassword } = require('../utils/password');
const CustomError = require('../utils/customError');
const prisma = new PrismaClient();


const isUsernameTaken = async (value, helpers) => {

    const existingUser = await prisma.user.findUnique({
        where: {
            username: value
        }
    });

    if (existingUser) {
        throw new Error(`Username ${value} is already taken`);
    }

    return value;

};

const isEmailTaken = async (value, helpers) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: value
            }
        });

        if (existingUser) {
            throw helpers.error('any.custom', { message: `An user with the following mail already exists: ${value}` });
        }

        return value;
    } catch (err) {
        throw new Joi.ValidationError('Invalid email', { message: err.message });
    }
};


const registrationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required()
        .external(isUsernameTaken),

    email: Joi.string()
        .email()
        .required()
        .external(isEmailTaken),

    avatar: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .allow(null, '').
        optional(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
        }),

    bio: Joi.string().allow(null, '').optional()
});

const loginSchema = Joi.object({
    username: Joi.string()
        .trim()
        .alphanum()
        .min(5)
        .max(50)
        .required()
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Please enter a username',
            'string.min': 'Username must be at least {#limit} characters long',
            'string.max': 'Username cannot be longer than {#limit} characters',
            'any.required': 'Username is required',
            'string.alphanum': 'Username must only contain alphanumeric characters',
        }),

    password: Joi.string()
        .trim()
        .min(8)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Please enter a password',
            'string.min': 'Password must be at least {#limit} characters long',
            'any.required': 'Password is required',
        }),

}).custom(async (credentials, helpers) => {
    const { username, password } = credentials;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new CustomError('Incorrect credentials', 'Username or password incorrect. You have a maximum of 5 login attempts. If you forgot your credentials, consider starting the recovery process', 400);;
        }

        if (user.failedLoginAttempts >= 5) {
            throw new CustomError('Account suspended', 'Your account has beeen suspended for security reasons, please contact the admins at museverse.support@gmail.com', 400);
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new CustomError('Incorrect credentials', 'Username or password incorrect. You have a maximum of 5 login attempts. If you forgot your credentials, consider starting the recovery process', 400);;
        }
        helpers.state.user = user;

        return { ...credentials, user };
    } catch (error) {
        throw helpers.error('any.custom', { message: 'Invalid credentials' });
    }
});


module.exports = {
    registrationSchema,
    loginSchema
}