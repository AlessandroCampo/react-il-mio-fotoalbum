const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

//custom middleware imports
const globalErrorHandler = require('./middlewares/globalErrorHandler.js');


//router imports
const userRouter = require('./routers/userRouter.js');
const pictureRouter = require('./routers/pictureRouter.js');




//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//NOTE - move to specific routes
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//router handled paths
app.use('/users', userRouter);
app.use('/pictures', pictureRouter);


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use(globalErrorHandler);


app.listen(PORT, () => {
    console.log(`Server is at http:/localhost:${3000}`);
});