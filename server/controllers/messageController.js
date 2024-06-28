const { PrismaClient } = require("@prisma/client");
const { userSocketMap } = require("../socket");
const prisma = new PrismaClient();
// const { userSocketMap } = require("../socket.js");



const sendMessage = async (req, res, next) => {
    const { userId, recipientId, content } = req.body;
    console.log(req.body);
    const data = {
        senderId: Number(userId),
        recipientId: Number(recipientId),
        content
    }
    try {

        const message = await prisma.message.create({
            data,
            include: {
                sender: true,
                recipient: true
            }
        }

        );
        const recipientSocketId = userSocketMap.get(recipientId);


        if (recipientSocketId) {
            // Emit a socket event to notify the recipient about the new message
            req.io.to(recipientSocketId).emit('newMessage', message);
        }
        return res.json({
            message
        })
    } catch (err) {
        next(err);
    }
};

const getAuthUserMessage = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { recipientId: userId }
                ]
            },
            include: {
                sender: {
                    select: {
                        username: true,
                        avatar: true,
                        id: true
                    }
                },
                recipient: {
                    select: {
                        username: true,
                        avatar: true,
                        id: true
                    }
                }
            }
        });

        res.json(messages);
    } catch (err) {
        next(err);
    }
};

module.exports = { sendMessage, getAuthUserMessage };