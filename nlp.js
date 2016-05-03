var natural = require ('natural');
var classifier = new natural.BayesClassifier();
var nools = require('nools');



module.exports = {

    q_mainfunction : function(answer){

        classifier.addDocument("at the beginning of the program","correct");
        classifier.addDocument("at the start of the program","correct");
        classifier.addDocument("When the program first executes","correct");
        classifier.addDocument("Just under #include","correct");
        classifier.addDocument("Just under the header files","correct");
        classifier.addDocument("Just after #include","correct");
        classifier.addDocument("Just after the header files","correct");
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
        classifier.addDocument("display the output of a program","correct");
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
        classifier.addDocument("container to store data","correct");
        classifier.addDocument("name given to the memory location where the actual data is stored","correct");

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

    q_compiler : function(answer5){

        classifier.addDocument("turns the program that you write into an executable that your computer can actually understand and run","correct");
        classifier.addDocument("converts your program into a machine readable language","correct");
        classifier.addDocument("reads source code and outputs assembly code or executable code","correct");
        classifier.addDocument("translates software written in source code into instructions that a computer can understand Software used to translate the text that a programmer writes into a format the CPU can use.","correct");
        classifier.addDocument("takes third-generation language code and translates it into a specific assembly code","correct");
        classifier.addDocument(" transforms source code written in a programming language into another computer language","correct");
        classifier.addDocument("that translates source code into object code","correct");
        classifier.addDocument("reads the instructions stored in the source code file, examines each instruction, and then translates the information into the machine code","correct");


        classifier.train();
        classifier.classify(answer5);
        var y = classifier.getClassifications(answer5);



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






