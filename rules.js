var nools = require ('nools');

var flow = nools.flow("Hello World", function (flow) {

    //find any message that starts with hello
    this.rule("Hello", [Number, "n", "n < 4"], function (facts) {
        console.log("tttttt");
    });

    //find all messages then end in goodbye
    this.rule("Goodbye", [String, "s", "s =~ /.*goodbye$/"], function (facts) {
        console.log(facts.s);
    });
});

var session = flow.getSession();

session.assert(3);
session.match();



