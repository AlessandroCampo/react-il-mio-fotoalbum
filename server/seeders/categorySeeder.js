const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const categories = [
    'Digital Art',
    'Photography',
    'Nature',
    'Architecture',
    'Travel',
    'Fashion',
    'Food',
    'Animals',
    'DIY & Crafts',
    'Interior Design',
    'Technology',
    'Sports',
    'Beauty',
    'Health & Fitness',
    'Education',
    'Music',
    'Movies',
    'Quotes',
    'Comics',
    'Cars & Motorcycles',
    'Gaming',
    'Books',
    'Art & Culture',
    'Science',
    'Weddings',
    'History',
    'Humor',
    'Kids & Parenting',
    'Tattoo',
    'Business',
    'Celebrities',
    'Gardening',
    'Outdoors',
    'Events',
    'Seasonal',
    'News',
    'People',
    'Travel Tips',
    'Shopping',
    'Marketing',
];

const createCategories = async (newCategories) => {
    const categoryData = newCategories.map(name => ({ name }));

    try {
        const result = await prisma.category.createMany({
            data: categoryData,
        });

        console.log(result.count + ' categories have been created');
    } catch (err) {
        throw new Error(err);
    }
}

createCategories(categories);