const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugify = require('slugify');

module.exports = async (name) => {
    let newSlug = slugify(name);
    let slugExists = true;
    let counter = 1;
    do {
        slugExists = await prisma.picture.findUnique({
            where: { slug: newSlug }
        });
        if (slugExists) {
            newSlug = `${slugify(name)}-${counter}`;
            counter++;
        }
    } while (slugExists);

    return newSlug.toLowerCase();
};
