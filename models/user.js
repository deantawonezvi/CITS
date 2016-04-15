var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    skill_level:String,
    lesson_counter: Number,
    quiz_counter: Number,
    progress:Number,
    learning_rate:{
        definition : Number,
        recognition : Number,
        application : Number
    },
    learning_deficiency:{
        definition:Number,
        recognition: Number,
        application: Number
    }


});