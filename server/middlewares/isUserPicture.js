const CustomError = require('../utils/customError.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new CustomError("User not found", "Error retrieving user data", 404);
        }

        const { id } = req.user;
        const { slug } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });
        const picture = await prisma.picture.findUnique({ where: { slug } });


        if (!picture) {
            throw new CustomError("Picture not found", `picture with slug ${slug} was not found`, 404);
        }

        if (user.id !== picture.userId) {
            throw new CustomError("Insufficient permission", "You are only allowed to update or delete your own pictures", 401);
        }

        next();
    } catch (err) {
        next(err);
    }
};
