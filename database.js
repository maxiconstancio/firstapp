path = require("path")
require('dotenv').config({ path: 'conf.env'});


const mongoose = require('mongoose');
//const {  Db } = require('mongodb');
(async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
        console.log("Mongodb is conected to ", db.connection.host)
    } catch (error) {
        console.error(error);
    }
})();
