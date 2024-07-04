const { PrismaClient } = require("@prisma/client")
const { hashPassword } = require('../utils/password.js');
const generateJWT = require("../utils/generateJWT.js");
const CustomError = require("../utils/customError.js");
const prisma = new PrismaClient();

//TODO - Limit the amount of user infomration sent to the client

const signup = async (req, res, next) => {

    const { username, password, email, image, bio } = req.body;

    try {
        const data = {
            username,
            password: await hashPassword(password),
            email,
            avatar: image,
            bio
        }

        const user = await prisma.user.create({
            data
        })

        const token = generateJWT(user)

        res.json({
            msg: 'A new user has been succesfully created',
            user,
            token
        })


    }

    catch (err) {
        console.error(err)
        next(err)
    }
}

const login = async (req, res, next) => {
    const { user } = req;
    const token = generateJWT(user);
    res.json({
        user,
        token
    })
}

const getInfo = async (req, res, next) => {
    const { username } = req.params;
    if (!username) {
        next(new CustomError("User not found", "Error retrieving  user data", 404));
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,

            },
            include: {
                followedBy: true,
                following: true,
                pictures: true,
                saves: true
            }
        });
        res.json({
            user
        })
    } catch (err) {
        next(err)
    }
}







module.exports = { signup, login, getInfo }