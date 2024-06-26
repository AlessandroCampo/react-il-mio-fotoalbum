const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const slugify = require('slugify');
const prisma = new PrismaClient();
require('dotenv').config();


//continue here
const createRandomPicture = async function (totalPics) {
    const users = await prisma.user.findMany({
        take: 50
    });
    const newPictures = []
    const categories = await prisma.category.findMany();

    for (let i = 0;i < totalPics;i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const title = faker.lorem.words(3);
        newPictures.push({
            title,
            slug: slugify(title),
            image: faker.image.urlLoremFlickr({ category: 'nature', width: 300, height: 240 }),
            description: faker.lorem.paragraphs(1),
            isVisibile: faker.datatype.boolean(),
            userId: randomUser.id,
            categories: {
                connect: [{ id: randomCategory.id }]
            }
        })
    }

    const createdPictures = [];

    try {
        for await (const newPicture of newPictures) {
            const createdPictrure = await prisma.picture.create({
                data: newPicture,
            });
            createdPictures.push(createdPictrure);
        }


    } catch (error) {
        console.error(error);
    }

    console.log(`${createdPictures.length} pictures have been succesfully created`);
    return createdPictures;
};

createRandomPicture(50);