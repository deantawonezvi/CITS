var nools = require ('nools');



var flow = nools.flow("Hello World", function (flow) {

    this.rule("Hello", [Number, "n", "n < 4"], function (facts) {
        console.log("tttttt");
    });

    this.rule("Missing Semicolon", [String, "s", "s =~ /.error: expected ',' or ';' ./"], function (facts) {
        console.log("Missing Semicolon in the code");
    });
    this.rule("Messed with return statement", [String, "s", "s =~ /.error: return-statement with no value./"], function (facts) {
        console.log("Messed with the return statement");
    });
    this.rule("Messed with #include statement 1", [String, "s", "s =~ /.error: missing terminating/"], function (facts) {
        console.log("Messed with the #include statement");
    });
    this.rule("Messed with #include statement 2", [String, "s", "s =~ /.error: 'include' does not name a type include  ^./"], function (facts) {
        console.log("Messed with the #include statement");
    });
    this.rule("Messed with #include statement 3", [String, "s", "s =~ /.No such file or directory #include  ^ compilation terminated./"], function (facts) {
        console.log("Messed with the #include statement");
    });
    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /.error: expected unqualified-id before '{' token { ^ ./"], function (facts) {
        console.log("Missing int main() or it is in wrong position");
    });
    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /.warning: extended initializer lists only available with./"], function (facts) {
        console.log("Messed brackets on the int main() function");
    });
    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are no longer supported return 0/"], function (facts) {
        console.log("Top curly bracket missing");
    });
    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expected '}' at end of/"], function (facts) {
        console.log("Bottom curly bracket missing");
    });

});

var session = flow.getSession();

session.assert('/../temp/sp0ikra.cpp:1:18: error: missing terminating > character #include ./' );
session.match().then(
    function(){
        console.log("Done");
    },
    function(err) {
        //uh oh an error occurred
        console.error(err.stack);
    });
nools.deleteFlow(flow);



