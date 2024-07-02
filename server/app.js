const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createServer } = require('node:http');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

const { initializeSocket, userSocketMap } = require('./socket.js');
const server = createServer(app);
initializeSocket(server);
const { Server } = require('socket.io');

//custom middleware imports
const globalErrorHandler = require('./middlewares/globalErrorHandler.js');


//router imports
const userRouter = require('./routers/userRouter.js');
const pictureRouter = require('./routers/pictureRouter.js');
const messageRouter = require('./routers/messageRouter.js');
const categoryRouter = require('./routers/categoryRouter.js');
const { getResearch, getCategories } = require('./controllers/generalController.js');




//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//NOTE - move to specific routes
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.io = require('./socket.js').getIo();
    next();
});

//router handled paths
app.use('/users', userRouter);
app.use('/pictures', pictureRouter);
app.use('/messages', messageRouter);
app.use('/categories', categoryRouter);


app.get('/research', getResearch);

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use(globalErrorHandler);


server.listen(PORT, () => {
    console.log(`Server is at http:/localhost:${3000}`);
});


module.exports = {
    userSocketMap
}