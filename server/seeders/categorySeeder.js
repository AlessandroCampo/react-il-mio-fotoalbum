const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const categories = [
    { name: 'Digital Art', thumbnail: 'http://localhost:3000/images/digital_art.jpg' },
    { name: 'Photography', thumbnail: 'http://localhost:3000/images/photography.jpeg' },
    { name: 'Nature', thumbnail: 'http://localhost:3000/images/nature.jpeg' },
    { name: 'Architecture', thumbnail: 'http://localhost:3000/images/architecture.jpeg' },
    { name: 'Travel', thumbnail: 'http://localhost:3000/images/travel.jpg' },
    { name: 'Fashion', thumbnail: 'http://localhost:3000/images/fashion.jpg' },
    { name: 'Food', thumbnail: 'http://localhost:3000/images/food.jpeg' },
    { name: 'Animals', thumbnail: 'http://localhost:3000/images/animals.jpeg' },
    { name: 'DIY & Crafts', thumbnail: 'http://localhost:3000/images/diy_and_crafts.jpg' },
    { name: 'Interior Design', thumbnail: 'http://localhost:3000/images/interior_design.jpg' },
    { name: 'Technology', thumbnail: 'http://localhost:3000/images/technology.jpg' },
    { name: 'Sports', thumbnail: 'http://localhost:3000/images/sports.jpg' },
    { name: 'Beauty', thumbnail: 'http://localhost:3000/images/beauty.jpeg' },
    { name: 'Health & Fitness', thumbnail: 'http://localhost:3000/images/health_and_fitness.jpeg' },
    { name: 'Education', thumbnail: 'http://localhost:3000/images/education.jpg' },
    { name: 'Music', thumbnail: 'http://localhost:3000/images/music.jpeg' },
    { name: 'Movies', thumbnail: 'http://localhost:3000/images/movies.jpg' },
    { name: 'Comics', thumbnail: 'http://localhost:3000/images/comics.jpg' },
    { name: 'Cars & Motorcycles', thumbnail: 'http://localhost:3000/images/cars_and_motorcycles.jpeg' },
    { name: 'Gaming', thumbnail: 'http://localhost:3000/images/gaming.jpeg' },
    { name: 'Books', thumbnail: 'http://localhost:3000/images/books.jpeg' },
    { name: 'Art & Culture', thumbnail: 'http://localhost:3000/images/art_and_culture.jpg' },
    { name: 'Science', thumbnail: 'http://localhost:3000/images/science.jpeg' },
    { name: 'Weddings', thumbnail: 'http://localhost:3000/images/weddings.jpeg' },
    { name: 'History', thumbnail: 'http://localhost:3000/images/history.jpeg' },
    { name: 'Kids & Parenting', thumbnail: 'http://localhost:3000/images/kids_and_parenting.jpeg' },
    { name: 'Tattoo', thumbnail: 'http://localhost:3000/images/tattoo.jpeg' },
    { name: 'Business', thumbnail: 'http://localhost:3000/images/business.jpeg' },
    { name: 'Celebrities', thumbnail: 'http://localhost:3000/images/celebrities.jpeg' },
    { name: 'Gardening', thumbnail: 'http://localhost:3000/images/gardening.jpeg' },
    { name: 'Events', thumbnail: 'http://localhost:3000/images/events.jpeg' },
    { name: 'News', thumbnail: 'http://localhost:3000/images/news.jpg' },
    { name: 'People', thumbnail: 'http://localhost:3000/images/people.jpeg' },
    { name: 'Shopping', thumbnail: 'http://localhost:3000/images/shopping.jpg' }
];


const createCategories = async (newCategories) => {

    try {
        const result = await prisma.category.createMany({
            data: newCategories,
        });

        console.log(result.count + ' categories have been created');
    } catch (err) {
        throw new Error(err);
    }
}

createCategories(categories);