const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const slugify = require('slugify');
const prisma = new PrismaClient();
require('dotenv').config();

// Category to image category mapping
const categoryImageMap = {
    'Digital Art': 'abstract',
    'Photography': 'people',
    'Nature': 'nature',
    'Architecture': 'city',
    'Travel': 'travel',
    'Fashion': 'fashion',
    'Food': 'food',
    'Animals': 'animals',
    'DIY & Crafts': 'crafts',
    'Interior Design': 'interior',
    'Technology': 'technology',
    'Sports': 'sports',
    'Beauty': 'beauty',
    'Health & Fitness': 'fitness',
    'Education': 'education',
    'Music': 'music',
    'Movies': 'movies',
    'Quotes': 'text',
    'Comics': 'comics',
    'Cars & Motorcycles': 'cars',
    'Gaming': 'games',
    'Books': 'books',
    'Art & Culture': 'art',
    'Science': 'science',
    'Weddings': 'weddings',
    'History': 'history',
    'Humor': 'humor',
    'Kids & Parenting': 'kids',
    'Tattoo': 'tattoos',
    'Business': 'business',
    'Celebrities': 'celebrities',
    'Gardening': 'gardening',
    'Events': 'events',
    'News': 'news',
    'People': 'people',
    'Shopping': 'shopping'
};

const createRandomPicture = async function (totalPics) {
    const users = await prisma.user.findMany({
        take: 50
    });
    const newPictures = [];
    const categories = await prisma.category.findMany();

    for (let i = 0;i < totalPics;i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const title = faker.lorem.words(3);
        const imageCategory = categoryImageMap[randomCategory.name] || 'nature'; // default to 'nature' if no match

        newPictures.push({
            title,
            slug: slugify(title),
            image: faker.image.urlLoremFlickr({ category: imageCategory, width: 300, height: 240 }),
            description: faker.lorem.paragraphs(1),
            isVisibile: faker.datatype.boolean(),
            userId: randomUser.id,
            categories: {
                connect: [{ id: randomCategory.id }]
            }
        });
    }

    const createdPictures = [];

    try {
        for await (const newPicture of newPictures) {
            const createdPicture = await prisma.picture.create({
                data: newPicture,
            });
            createdPictures.push(createdPicture);
        }
    } catch (error) {
        console.error(error);
    }

    console.log(`${createdPictures.length} pictures have been successfully created`);
    return createdPictures;
};

createRandomPicture(250);
