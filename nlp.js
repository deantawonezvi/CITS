var natural = require ('natural');
var classifier = new natural.BayesClassifier();
var nools = require('nools');



module.exports = {

    q_mainfunction : function(answer){

        classifier.addDocument("at the beginning of the program","correct");
        classifier.addDocument("at the start of the program","correct");
        classifier.addDocument("When the program first executes","correct");
        classifier.addDocument("Just under #include","correct");


        classifier.train();

        classifier.classify(answer);
        var y = classifier.getClassifications(answer);
        if(y[0].value <=0.6){
            return 1;
        }
        if (y[0].value>0.5 && y[0].value<=0.9){
            return 1.5 ;
        }
        if(y[0].value == 1){
            return 2
        }

    },

    q_printf : function(answer1){

        classifier.addDocument("displays output to the screen","correct");
        classifier.addDocument("shows output to the screen","correct");
        classifier.addDocument("reveals the output of the program","correct");

        classifier.train();

        classifier.classify(answer1);
        var y = classifier.getClassifications(answer1);
        if(y[0].value <=0.6){
            return 1;
        }
        if (y[0].value>0.5 && y[0].value<=0.9){
            return 1.5 ;
        }
        if(y[0].value == 1){
            return 2
        }


    },

    q_include : function(answer2){

    },

    q_getchar : function(answer3){

    }


};

classifier.addDocument("at the beginning of the program","correct");
classifier.addDocument("at the start of the program","correct");
classifier.addDocument("When the program first executes","correct");
classifier.addDocument("Just under #include","correct");


classifier.train();

classifier.classify("at the beginning of the program");
console.log(classifier.getClassifications("at the beginning of the program"));







