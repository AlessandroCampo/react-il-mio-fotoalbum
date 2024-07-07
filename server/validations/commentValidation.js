const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const prisma = new PrismaClient();

const commentCreate = Joi.object({
    content: Joi.string()
        .required()
        .max(500),
    pictureId: Joi.number()
        .required()
        .integer()
        .external(async (value, helpers) => {
            const foundPicture = await prisma.picture.findUniqueOrThrow({
                where: { id: value }
            });
            if (foundPicture) {
                return foundPicture.id;
            }
        })
    ,
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

})



module.exports = { commentCreate };