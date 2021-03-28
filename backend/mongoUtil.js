const mongoose = require('mongoose');

//Database Details
const MONGO_USERNAME = 'blogAdmin';
const MONGO_PASSWORD = 'blogAdmin';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'SEOblog';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
module.exports = ()=> {
    mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).
    then(()=>console.log(`Database connected with user: ${MONGO_USERNAME}`));
    return mongoose;
}
