const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const index = async (req, res, next) => {
    try {

        const categories = await prisma.category.findMany({
            orderBy: {
                pictures: {
                    _count: 'desc'
                }
            },
        });
        return res.json({
            categories
        })
    } catch (err) {

        next(err);
    }
}

const show = async (req, res, next) => {
    const { category } = req.params;
    try {
        const foundCategory = await prisma.category.findFirst({
            where: {
                name: category
            },
            include: {
                pictures: {
                    take: 12
                }
            }
        })

        res.json(foundCategory);
    } catch (err) {
        nexr(err);
    }
}

module.exports = { index, show }