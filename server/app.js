const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const app = express();
//middlewares

app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.send('Hello world')
})


app.listen(PORT, () => {
    console.log(`Server is at http:/localhost:${3000}`);
});