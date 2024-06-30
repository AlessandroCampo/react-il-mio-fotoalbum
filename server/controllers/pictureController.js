const { PrismaClient } = require("@prisma/client");
const createUniqueSlug = require("../utils/createUniqueSlug");
const { userSocketMap } = require("../socket");
const { connect } = require("../routers/pictureRouter");


const prisma = new PrismaClient();




const index = async (req, res, next) => {
    const where = {
        isVisibile: true
    };
    const { page = 1, limit = 10, containedString } = req.query;
    if (containedString) where.title = { contains: containedString };




    const offset = (page - 1) * limit;
    const totalPosts = await prisma.picture.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);

    try {

        const pictures = await prisma.picture.findMany({
            take: Number(limit),
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                User: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
                comments: {
                    include: {
                        User: {
                            select: {
                                username: true,
                                avatar: true
                            }
                        }
                    }
                },
                categories: true,
                likes: true
            },
            where
        });
        return res.json({
            message: `${pictures.length} ${pictures.length > 1 ? 'pictures' : 'picture'} have been found on page number ${page}`,
            pictures,
            currentPage: page,
            totalPages
        })
    } catch (err) {

        next(err);
    }
};

const getPersonalizedFeed = async (req, res, next) => {

    const where = {
        isVisibile: true,
        userId: { not: req.user.id }
    };
    const { page = 1, limit = 10, containedString } = req.query;
    if (containedString) where.title = { contains: containedString };




    const offset = (page - 1) * limit;
    const totalPosts = await prisma.picture.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);

    try {

        const pictures = await prisma.picture.findMany({
            take: Number(limit),
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                User: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
                comments: {
                    include: {
                        User: {
                            select: {
                                username: true,
                                avatar: true
                            }
                        }
                    }
                },
                categories: true,
                likes: true
            },
            where
        });
        return res.json({
            message: `${pictures.length} ${pictures.length > 1 ? 'pictures' : 'picture'} have been found on page number ${page}`,
            pictures,
            currentPage: page,
            totalPages
        })
    } catch (err) {

        next(err);
    }
};

const create = async (req, res, next) => {
    const { title, description, userId, image, categories } = req.body;
    console.log(req.body);
    const user = req.user;
    const formattedCategories = categories.map(c => ({ id: Number(c) }));
    try {
        const data = {
            title,
            description,
            userId,
            image,
            slug: await createUniqueSlug(title),
            categories: {
                connect: formattedCategories
            }
        }

        const picture = await prisma.picture.create({
            data,
            include: {
                categories: true
            }
        })

        res.json({
            msg: 'A new picture has been succesfull posted',
            picture: {
                ...picture,
                likes: [],
                comments: [],
                saves: [],
                downloads: [],
                views: []
            }
        })

    } catch (err) {
        next(err)
    }
}
const show = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const picture = await prisma.picture.findUniqueOrThrow({
            where: { slug: slug },
            include: {
                User: {
                    include: {
                        followedBy: {
                            select: {
                                _count: true
                            }
                        }
                    }
                },
                categories: true,
                likes: true,
                saves: true,
                views: true
            }
        })
        res.json(picture);
    } catch (err) {
        next(err)
    }
}

const destroy = async (req, res, next) => {
    const { slug } = req.params;
    try {
        const picture = await prisma.picture.delete({
            where: { slug: slug }
        })
        res.json({
            msg: `Picture with tilte ${picture.title} has beeen succesfully deleted`,
            picture
        });
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const { title, description, categories, userId } = req.body;
        console.log(req.body)
        const { slug } = req.params;

        const formattedCategories = categories.map(c => ({ id: Number(c) }));
        const data = {
            title,
            description,
            categories: {
                set: formattedCategories
            }
        };


        const picture = await prisma.picture.update({
            where: { slug },
            data
        })

        res.json(picture);



    } catch (err) {
        next(err)
    }
}

const hideOrShow = async (req, res, next) => {
    try {
        const { isVisibile } = req.body;
        const { slug } = req.params;
        const picture = await prisma.picture.update({
            where: { slug },
            data: {
                isVisibile
            }
        })
        res.json(picture);
    } catch (err) {
        next(err)
    }
}

const getCategories = async (req, res, next) => {
    try {

        const categories = await prisma.category.findMany();
        return res.json({
            categories
        })
    } catch (err) {

        next(err);
    }
}

const like = async (req, res, next) => {
    const { slug } = req.params;
    const { userId, pictureId, authorId } = req.body;
    console.log(authorId)
    try {
        const data = {
            userId, pictureId

        }
        const like = await prisma.like.create({
            data,
            include: {
                User: true
            }
        });

        const recipientSocketId = userSocketMap.get(authorId);
        req.io.to(recipientSocketId).emit('newLike', like);

        res.json({ like })
    } catch (err) {
        next(err);
    }



}

// const removeLike = async (req, res, next) => {
//     const { slug } = req.params;
//     const { likeId } = req.body;
//     try {
//         if (!likeId) {
//             throw new CustomError('Like not found', `You have not liked the post with slug ${slug}`, 404);
//         }
//         const removedLike = await prisma.like.delete({
//             where: {
//                 id: likeId
//             }
//         });
//         res.json({
//             message: `Your like has been removed from the post  with slug ${slug}`,
//             removedLike,
//         })
//     } catch (err) {
//         const customError = prismaErorrHandler(err);
//         next(customError);
//     }


// }

module.exports = { index, create, show, destroy, update, hideOrShow, getCategories, like, getPersonalizedFeed }