const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getResearch = async (req, res, next) => {
    const { query } = req.query;
    const searchString = query.trim();
    console.log(searchString);
    try {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: searchString,
                },
            },
            select: {
                username: true,
                avatar: true
            },
            orderBy: {
                followedBy: {
                    _count: 'desc'
                }
            },
            take: 5
        });

        const pictures = await prisma.picture.findMany({
            where: {
                title: {
                    startsWith: searchString,
                }
            },
            select: {
                title: true,
                slug: true,
                image: true
            },
            orderBy: {
                views: {
                    _count: 'desc'
                }
            },
            take: 5
        });

        const categories = await prisma.category.findMany({
            where: {
                name: {
                    startsWith: searchString
                }
            },
            select: {
                name: true,
                thumbnail: true
            },
            take: 3
        })

        const formattedCategories = categories.map(c => ({
            type: 'Category',
            label: c.name,
            image: c.thumbnail
        }))

        const formattedUsers = users.map(u => ({
            type: 'User',
            label: u.username,
            image: u.avatar
        }))

        const formattedPictures = pictures.map(p => ({
            type: 'Picture',
            label: p.title,
            image: p.image,
            slug: p.slug
        }))

        res.json({
            options: [...formattedPictures, ...formattedUsers]
        })


    } catch (err) {
        next(err);
    }
}


module.exports = { getResearch };