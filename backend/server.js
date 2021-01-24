//Import required modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoUtil = require('./mongoUtil');
//Add environment variables from .env
require('dotenv').config();

//Routes
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const tagRoutes = require('./routes/tag')

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
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',tagRoutes);

const port = process.env.port || 8000
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
});