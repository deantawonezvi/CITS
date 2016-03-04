var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    skill_level:String,
    lesson_counter: Number
});