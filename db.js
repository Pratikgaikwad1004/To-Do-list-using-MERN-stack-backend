const mongoose = require('mongoose');

const URI = "mongodb://localhost:27017/To-Do_List";

const connect = () => {
    mongoose.connect(URI, ()=>{
        console.log("connected to mongo successfully");
    })
}

module.exports = connect;