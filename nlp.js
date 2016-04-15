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
        classifier.addDocument("input of the program","wrong");
        classifier.addDocument(["not","cannot","does not"], "wrong");
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
        classifier.addDocument("display the output","correct");
        classifier.addDocument("display the output of the program","correct");
        classifier.addDocument("shows output to the screen","correct");
        classifier.addDocument("show the output of a program to the screen","correct");
        classifier.addDocument("prints the output to the screen","correct");
        classifier.addDocument("reveals the output of the program","correct");
        classifier.addDocument("does not print the output of the program", "wrong");
        classifier.addDocument("display the input of the program", "wrong");
        classifier.addDocument("does not show the output of the program", "wrong");
        classifier.addDocument(["not","cannot","does not"], "wrong");
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
    q_variable : function(answer4){
        classifier.addDocument("Place where data is stored","correct");
        classifier.addDocument("Name to refer to some location in memory","correct");
        classifier.addDocument("Name given to a storage area that our programs can manipulate","correct");
        classifier.addDocument("memory location in computer's memory to store data","correct");
        classifier.addDocument("container to store the data","correct");
        classifier.addDocument("location in memory used by a program to store data","correct");
        classifier.addDocument(["not","cannot","does not"], "wrong");

        classifier.train();
        var x = classifier.getClassifications(answer4);
        //Correct Answer
        if(x[0].label =="correct" && x[0].value < 0.6){
            return 1;
        }
        //Wrong Answer
        if(x[0].label =="wrong"){
            return 1.5;
        }
        //Totally Wrong Answer
        if(x[0].label =="correct" && x[0].value>0.6){
            return 2;
        }
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


classifier.addDocument("place where data is stored","correct");
classifier.addDocument("name to refer to some location in memory","correct");
classifier.addDocument("name given to a storage area","correct");
classifier.addDocument("memory location in computer's memory to store data","correct");
classifier.addDocument("container to store the data of a program","correct");
classifier.addDocument("location in memory used by a program to store data","correct");
classifier.addDocument(["storage area","data storage","memory location","storage container","storing"], "correct");
classifier.addDocument(["not","cannot","does not"], "wrong");

classifier.train();
var x = classifier.getClassifications("not place where data is stored");

if(x[0].label =="correct" && x[0].value < 0.6){
    console.log("Correct");
    console.log(x);
}
if(x[0].label =="wrong"){
    console.log("Wrong");
    console.log(x);
}
if(x[0].label =="correct" && x[0].value>0.6){
    console.log("Come On! You did not even try");
    console.log(x);
}




