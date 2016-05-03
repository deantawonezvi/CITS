var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    skill_level:String,
    lesson_counter: Number,
    quiz_counter: Number,
    progress:Number,
    evaluation_progress:Number,
    learning_rate:{
        definition : Number,
        recognition : Number,
        application : Number
    },
    common_errors:{
        syntax:Number,
        logic:Number

    },
    cheating_index:Number,
    learning_deficiency:{
        definition:Number,
        recognition: Number,
        application: Number
    },
    evaluation_score:{
        ans1:Number,
        ans2:Number,
        ans3:Number
    },
    revision_progress:Number,
    revision_score:{
        q1:Number,
        q2:Number,
        q3:Number,
        q4:Number,
        q5:Number,
        q6:Number
    }

});