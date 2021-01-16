const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoUtil = require('./mongoUtil');
require('dotenv').config();

//Routes
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')

const app = express()
//Database connection implementation: mongoUtil
const mongoose = mongoUtil();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
if(process.env.NODE_ENV== 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}` }));
}
//routes middleware
app.use('/api',blogRoutes);
app.use('/api',authRoutes);

const port = process.env.port || 8000
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
});