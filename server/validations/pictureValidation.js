const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const CustomError = require('../utils/customError');
const prisma = new PrismaClient();

const validateCategories = async (value, helpers, imageUrl) => {

    // Fetch all existing categories in a single query
    const existingCategories = await prisma.category.findMany({
        where: {
            name: { in: value }
        }
    });

    const existingCategoryNames = existingCategories.map((cat) => cat.name);
    const categoryIds = existingCategories.map(cat => cat.id);

    for (const name of value) {
        if (!existingCategoryNames.includes(name)) {
            const newCategory = await prisma.category.create({
                data: {
                    name,
                    thumbnail: imageUrl
                }
            });
            categoryIds.push(newCategory.id);
        }
    }
    console.log(categoryIds, 'coming from sanitizer')
    return categoryIds;
};

const pictureCreateSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.base': 'Title must be a string',
            'string.empty': 'Title cannot be empty',
            'string.max': 'Title cannot be longer than {#limit} characters',
            'any.required': 'Title is required',
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.empty': 'Description cannot be empty',
            'string.max': 'Description cannot be longer than {#limit} characters',
            'any.required': 'Description is required',
        }),

    image: Joi.string()
        .trim()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
            'string.base': 'Image must be a string',
            'string.empty': 'Image URL cannot be empty',
            'string.uri': 'Image must be a valid URL',
            'any.required': 'Image URL is required',
        }),

    categories: Joi.array()
        .items(Joi.string())
        .external(async (value, helpers) => {
            const { image } = helpers.state.ancestors[0];
            const categoryIds = await validateCategories(value, helpers, image);
            return categoryIds;
        })
        .required()
        .messages({
            'any.required': 'Categories are required',
            'array.base': 'Categories must be an array',
            'array.empty': 'Categories array cannot be empty',
            'any.custom': 'Invalid categories provided',
        }),

    userId: Joi.number()
        .required()
        .external(async (value, helpers) => {
            const foundUser = await prisma.user.findUniqueOrThrow({
                where: { id: value }
            });
            if (foundUser) {
                return foundUser.id;
            }
        })
});

const pictureUpdateSchema = Joi.object({
    title: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.base': 'Title must be a string',
            'string.empty': 'Title cannot be empty',
            'string.max': 'Title cannot be longer than {#limit} characters',
            'any.required': 'Title is required',
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .required()
        .messages({
            'string.base': 'Description must be a string',
            'string.empty': 'Description cannot be empty',
            'string.max': 'Description cannot be longer than {#limit} characters',
            'any.required': 'Description is required',
        }),
    categories: Joi.array()
        .items(Joi.number())
        .external(validateCategories, 'validate categories')
        .required()
        .messages({
            'any.required': 'Categories are required',
            'array.base': 'Categories must be an array',
            'array.empty': 'Categories array cannot be empty',
            'any.custom': 'Invalid categories provided',
        }),
    userId: Joi.number()
        .required()
        .external(async (value, helpers) => {
            const foundUser = await prisma.user.findUniqueOrThrow({
                where: { id: value }
            })
            if (foundUser) {
                return foundUser.id
            }
        })

})

module.exports = { pictureCreateSchema, pictureUpdateSchema }