var natural = require ('natural');
var classifier = new natural.BayesClassifier();


module.exports = {

    qsn_1: function(answer){
       classifier.addDocument("When the program executes first");
        classifier.addDocument("Function that executes first in a program");
        classifier.addDocument("At the start of the program");
        classifier.addDocument("At the beginning of the program");








    }



}
