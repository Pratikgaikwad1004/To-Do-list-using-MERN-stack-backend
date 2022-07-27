const mongoose = require('mongoose');
const { Schema } = mongoose;

const ToDoSchema = new Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    task:{
        type : String,
        require : true
    },
    status:{
        type : Boolean,
        default : false
    },
    priority:{
        type : String,
        require : true
    },
    date:{
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('todo', ToDoSchema);