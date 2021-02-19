const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
dotenv.config({path: '../.env'});

const DB = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

run().catch(console.dir);

async function run() {
    try {
        const connection = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true,
            dbName: 'PvPScience'
        });
        console.log('Connected to db...');
    }
    catch (e) {
        console.error(e.message);
    }
}

async function deleteMany() {
    try {
        await User.deleteMany();
        console.log('delete successful');
    }
    catch (err) {  
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--delete') {
    deleteMany();
}






