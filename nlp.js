var natural = require ('natural');
var classifier = new natural.BayesClassifier();
var nools = require('nools');



module.exports = {

    q_mainfunction : function(answer){

        classifier.addDocument("at the beginning of the program","correct");
        classifier.addDocument("at the start of the program","correct");
        classifier.addDocument("When the program first executes","correct");
        classifier.addDocument("Just under #include","correct");
        classifier.addDocument("does not", "wrong");
        classifier.addDocument("cannot cannot display the output of the program", "wrong");

        classifier.train();

        classifier.classify(answer);
        var y = classifier.getClassifications(answer);
        if(y[0].value <=0.6){
            return 1;
        }
        if (y[0].value>0.5 && y[0].value<=0.9){
            return 1.5 ;
        }
        if(y[0].value == 1 || y[0].label =="wrong"){
            return 2
        }

    },

    q_printf : function(answer1){

        classifier.addDocument("displays output to the screen","correct");
        classifier.addDocument("shows output to the screen","correct");
        classifier.addDocument("reveals the output of the program","correct");
        classifier.addDocument("does not display the output of the program", "wrong");
        classifier.addDocument("display the input of the program", "wrong");



        classifier.train();

        classifier.classify(answer1);
        var y = classifier.getClassifications(answer1);
        if(y[0].value <=0.6 && y[0].label == "correct"){
            return 1;
        }
        if (y[0].value>0.5 && y[0].value<=0.9){
            return 1.5 ;
        }
        if(y[0].value == 1 || y[0].label =="wrong"){
            return 2
        }


    },

    q_include : function(answer2){

    },

    q_getchar : function(answer3){

    },

    q_program_mainfunction: function(answer4){

        classifier.addDocument("error: expected unqualified-id before '{' token { ^",'wrong position');
        classifier.addDocument("error: expected '}' before ';' token printf","wrong declaration");
        classifier.addDocument("error: missing terminating > character #include <stdio.h","messed with code");
        classifier.addDocument("error: expected constructor, destructor, or type conversion before '(' token printf(","messed with code");
        classifier.addDocument("error: expected ';' before 'return'","messed with code");

        classifier.train();

        classifier.classify(answer4);
        var y = classifier.getClassifications(answer4);


        //wrong declaration
        if(y[0].value < 0.3 && y[0].label == 'wrong position'){
            return 0;
        }
        //messed with code
        if(y[0].label == 'messed with code'){
            return 0.5;
        }
        //wrong position
        else{
           return 1
        }




        }


};


classifier.addDocument("displays output to the screen","correct");
classifier.addDocument("shows output to the screen","correct");
classifier.addDocument("reveals the output of the program","correct");
classifier.addDocument("display the input of the program", "wrong");


classifier.train();

var y = classifier.getClassifications("display the input of the program");

console.log(y);

