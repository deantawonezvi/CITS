var express = require('express');
var router = express.Router();
var natural = require('natural');
var nools = require('nools');
var compiler = require('compilex');
var nlp = require('../nlp.js');
var option = {stats : true};
compiler.init(option);
var output = "";
var qresonse = "";
var progress = 0;
var definition_counter = 1;
var recognition_counter = 1;
var application_counter = 1;
var tokenizer = new natural.TreebankWordTokenizer();




var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function(passport,io){

  /* GET login page. */
  router.get('/', function(req, res) {

    res.render('index', { message: req.flash('message') });
        });
  router.get('/login', function(req, res) {


    res.render('login', { message: req.flash('message') });
  });
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash : true
  }));
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash : true
  }));
  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });
  /* Handle Logout */
  router.get('/signout', function(req, res) {
      req.session.destroy(function (err) {
          res.redirect('/'); //Inside a callback… bulletproof!
      });
  });
    router.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user, out:output,
            q_response:qresonse,
            q_progress: progress,
            message: req.flash('message'),
            info: req.flash('info') });

  });
    router.post('/profile', function(req,res){
        req.user.skill_level = req.body.skill_level;

        req.user.save(function(err){
             if(err)
                return err;
         });
        res.redirect('/profile');

    });

    router.post('/lesson_1', function(req,res){
        req.user.lesson_counter = 1;

        req.user.save(function(err){
            if(err)
                return err;
        });
        res.redirect('/profile');
    });

    router.post('/lesson_2',function(req,res){
            req.user.update({lesson_counter: 2}, function (err) {
                if (err) {
                    return err;
                }
            });
            res.redirect('/profile');
    });

    router.post('/lesson_3',function(req,res){
        if (req.body.feedback == "yes"){
            req.user.update({lesson_counter :3}, function(err){
                if (err){
                    return err;
                }
            });
            res.redirect('/profile');
        }
        if (req.body.feedback == "no"){
            res.redirect('profile')
        }
        if (req.body.feedback == "quiz"){
            req.user.update({
                    lesson_counter:2.1,
                    quiz_counter:1
                },
                function(err){
                if (err){
                    return err;
                }
            });
         res.redirect('/profile')

        }



    });

    router.post('/lesson_4',function(req,res){

        if (req.body.feedback == "quiz"){

            req.user.update({
                    lesson_counter:4,
                    quiz_counter:3
                },
                function(err){
                    if (err){
                        return err;
                    }
                });
            res.redirect('/profile')

        }



    });

    router.get('/compile', function(req,res){
        res.render('compilex',{user:req.user});
    });

    router.post('/q1', function(req,res) {


        req.user.progress = 1;
        req.user.save(function (err) {
            if (err) throw err;
        });


        var q1 = nlp.q_mainfunction(req.body.main_function);

        if (tokenizer.tokenize(req.body.main_function).length < 2) {
            req.flash('message','I cannot accept that as an answer. Please try again');
            res.redirect("/profile");
        }
        else{

        // Correct Answer
        if (q1 == 1) {
            qresonse = 1;
            req.user.learning_rate.definition = definition_counter;
            req.user.save(function (err) {
                if (err) throw err;
            });
            console.log(req.user.learning_rate.definition);
        }

        // Wrong Answer
        if (q1 == 1.5) {
            qresonse = 1.5;
            req.user.learning_rate.definition = 0;
            req.user.save(function (err) {
                if (err) throw err;
            });

        }
        if (q1 == 2) {
            qresonse = 2;
            req.user.learning_rate.definition = 0;
            req.user.save(function (err) {
                if (err) throw err;
            });
        }
        console.log(qresonse);


        res.redirect('/profile');
    }
    });

    router.post('/q3', function(req,res){
        var q3 = nlp.q_printf(req.body.printf);

        req.user.progress = 2;
        req.user.save(function(err){
            if(err) throw err;
        });

            if (q3 == 1) {
                qresonse = 1;
                definition_counter += 1;
                req.user.learning_rate.definition = definition_counter;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                console.log(definition_counter);
            }
            if (q3 == 1.5) {
                qresonse = 1.5;
                req.user.learning_rate.definition = 0;
                req.user.save(function (err) {
                    if (err) throw err;
                });
            }
            if (q3 == 2) {
                qresonse = 2;
                req.user.learning_rate.definition = 0;
                req.user.save(function (err) {
                    if (err) throw err;
                });
            }
            console.log(q3);
            res.redirect('/profile');
    });

    router.post('/q2' , function (req , res ) {

        req.user.progress = 3;
        req.user.save(function(err){
            if(err) throw err;
        });
        var code = req.body.code;

        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            //Wrong Answer
            if(data.error)
            {
                console.log(data.error);
                var flow = nools.flow("Int main", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                       qresonse = 0.5;
                       res.redirect('/profile');
                       application_counter+=5;
                       req.user.learning_rate.application = application_counter;
                       req.user.save(function(err){
                          if(err) throw err;
                         });
                    });
                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory #include./"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        qresonse = 0;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        qresonse = 0;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        qresonse = 0;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expect at end of input/"], function (facts) {
                        qresonse = 0.5;
                        res.redirect('/profile');
                        application_counter+=5;
                        req.user.learning_rate.application = application_counter;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
                console.log(qresonse);

            }
            //Correct Answer
            else
            {
                qresonse = 2;
                output = data.output;
                res.redirect('/profile');
                req.user.learning_rate.application = application_counter;
                req.user.save(function(err){
                    if(err) throw err;
                });

            }
            console.log(qresonse);
            compiler.flush(function(){
                console.log('All temporary files flushed !');
            });
        });
    });

    router.post('/q_variable', function(req,res){
        qresonse = 0;

        req.user.quiz2_progress = 1;
        req.user.save(function (err) {
            if (err) throw err;
        });
        var variable_answer = nlp.q_variable(req.body.variable);


        if (tokenizer.tokenize(req.body.variable).length < 2) {
            req.flash('message','I cannot accept that as an answer. Please try again.');
            res.redirect("/profile");
        }
        else {
            //correct answer
            if (variable_answer == 1) {
                req.user.lesson_answers.q_variable = 1;
                req.user.save(function (err) {
                    if (err) throw err;
                });
            }
            //Wrong Answer
            if (variable_answer == 1.5) {
                req.user.lesson_answers.q_variable = 1.5;
                req.user.save(function (err) {
                    if (err) throw err;
                });
            }
            //Totally Wrong Answer
            if (variable_answer == 2) {
                req.user.lesson_answers.q_variable = 2;
                req.user.save(function (err) {
                    if (err) throw err;
                });
            }
            console.log(qresonse);

        }
        res.redirect('/profile');




    });

    router.post('/q_variable_program', function(req,res){
        var code = req.body.code;
        var correct_code = new RegExp(/int\s*\w+\s*;/);
        var correct_result = correct_code.test(code);

        req.user.update({quiz2_progress: 2}, function (err) {
            if (err) {
                return err;
            }
        });
        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            if(data.error) {
                console.log(data.error);
                var flow = nools.flow("Addition Program Error", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable 2", [String, "s", "s =~ /was not declared in this scope/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared. Please make sure that each variable has its appropriate variable type');
                        res.redirect("/profile");
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        res.send("Type Casting");
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        res.send("Messed with the return statement");
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory #include./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        req.flash('message','Top curly bracket missing');
                        res.redirect("/profile");
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expect at end of input/"], function (facts) {
                        req.flash('message','Bottom curly bracket missing');
                        res.redirect("/profile");
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
            }

            else{
                if (correct_result==true){
                    res.send("Well Done");
                }
                else{
                    res.send("Follow Instructions");
                }


            }

        })

    });

    router.post('/q1_evaluation', function(req,res){
        var ans =0;
        var q1 = nlp.q_mainfunction(req.body.main_function);
        req.user.evaluation_progress = 0.5;
        req.user.save(function(err){
            if(err) throw err;
        });

        if (tokenizer.tokenize(req.body.main_function).length < 2) {
            req.flash('message','I cannot accept that as an answer. Please try again.');
            res.redirect("/profile");
        }
        else {

            if (q1 == 1) {
                req.user.evaluation_progress = 1;
                req.user.save(function(err){
                    if(err) throw err;
                });
                ans = 1;
                req.user.evaluation_score.ans1 = ans;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                res.redirect('/profile');
                console.log(ans);
            }
            // Wrong Answer
            if (q1 == 1.5) {
                ans = 1.5;
                req.user.evaluation_progress = 1;
                console.log(ans);
                req.user.evaluation_score.ans1 = ans;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                res.redirect('/profile');

            }
            if (q1 == 2) {
                ans = 2;

                req.user.evaluation_progress = 1;
                console.log(ans);
                req.user.evaluation_score.ans1 = ans;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                res.redirect('/profile');


            }
        }
        console.log(qresonse);





    });

    router.post('/q2_evaluation', function(req,res,next){
        var correct = new RegExp(/(\w+)\s*=((\s*\w+\s*[-+\/%])\s*\w+\s*)/);
        var correct1 = new RegExp(/(\w+)\s*\+\s*(\w+)/);
        var cheating = new RegExp(/(\w+\s*)=(\s*[1-9]\d{2,}|[0-9]\d)/);
        var code = req.body.code;
        var correct_result = correct.test(code);
        var correct1_result = correct1.test(code);
        var cheating_result = cheating.test(code);
        req.user.evaluation_progress = 1;
        req.user.save(function(err){
            if(err) throw err;
        });

        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            if(data.error) {
                console.log(data.error);
                var flow = nools.flow("Addition Program Error", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable 2", [String, "s", "s =~ /was not declared in this scope/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared. Please make sure that each variable has its appropriate variable type');
                        res.redirect("/profile");
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        res.send("Type Casting");
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        res.send("Messed with the return statement");
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory #include./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        req.flash('message','Top curly bracket missing');
                        res.redirect("/profile");
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expect at end of input/"], function (facts) {
                        req.flash('message','Bottom curly bracket missing');
                        res.redirect("/profile");
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
            }

            else
            {
                console.log(data.output);
                if(data.output==10) {


                    console.log(correct_result);
                    console.log(correct1_result);
                    console.log(cheating_result);
                    //Correct Code
                    if((correct_result==true||correct1_result==true) && cheating_result==false){
                        req.user.evaluation_score.ans1 = 1;
                        req.user.save(function(err){
                            if(err) throw err;
                        });
                        req.user.update({evaluation_progress: 2}, function (err) {
                            if (err) {
                                return err;
                            }
                        });

                        res.redirect("/profile");
                    }
                    //Cheating Code
                    if(correct_result==true && cheating_result==true){
                        res.send("Cheater");
                    }
                    //Cheating
                    if(correct_result==false && cheating_result==true){
                        res.send("Cheater");

                    }
                    if(correct_result==false && cheating_result==false){
                        res.send("Cheater");

                    }
                }
                if(data.output !=10){
                    ans = 0.5;
                    res.send("Please follow the instructions");
                    req.user.evaluation_score.ans2 = ans;
                    req.user.save(function(err){
                        if(err) throw err;
                    });
                   }

                }




        });

    });

    router.post('/q3_evaluation', function(req,res){
        var correct = new RegExp(/(\w+)\s*(<\s*=|<|=|>)\s*(\d+\s*)/);
        var correct1 = new RegExp(/(\w+)\s*\+\s*\+/);
        var cheating = new RegExp();
        var code = req.body.code;
        var correct_result = correct.test(code);
        var correct1_result = correct1.test(code);
        var cheating_result = cheating.test(code);
        req.user.evaluation_progress = 2;
        req.user.save(function(err){
            if(err) throw err;
        });

        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            if(data.error) {
                console.log(data.error);
                var flow = nools.flow("Natural Numbers Program Error", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        res.send("Missing Semicolon in the code");
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        res.send("Missing Semicolon in the code");
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        res.send("Missing Semicolon in the code");
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        res.send("Undeclared Variable");
                    });
                    this.rule("Undeclared variable 2", [String, "s", "s =~ /was not declared in this scope/"], function (facts) {
                        res.send("Undeclared Variable");
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        res.send("Type Casting");
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        res.send("Messed with the return statement");
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                        res.send("Messed with the #include statement");
                    });
                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        res.send("Messed with the #include statement");
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory #include./"], function (facts) {
                        res.send("Messed with the #include statement");
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        res.send("Messed with the #include statement");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        res.send("Messed with the #include statement");
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        res.send("Missing int main() or it is in wrong position");
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        res.send("Messed brackets on the int main() function");
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        res.send("Messed brackets on the int main() function");
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        res.send("Top curly bracket missing");
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expect at end of input/"], function (facts) {
                        res.send("Bottom curly bracket missing");
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
            }

            else{
                var token = tokenizer.tokenize(data.output).length;
                if(data.output == '12345678910'|| token==10) {
                    if(correct_result==true&&correct_result==true){
                        res.send("Correct");
                    }
                    else{
                        res.send('Cheater');
                    }

                }
                if(data.output !== '12345678910') {
                    res.send("Wrong");
                }


            }




        });

    });

    router.post('/q4_evaluation',function(req,res){

        var q4 = nlp.q_compiler(req.body.compiler);

    });


    router.post('/q1_revision', function(req,res){

        var q1 = nlp.q_variable(req.body.a_variable);
        console.log(q1);

        if (tokenizer.tokenize(req.body.a_variable).length < 2) {
            req.flash('message','I cannot accept that as an answer. Please try again.');
            res.redirect("/profile");
        }
        else {

            if (q1 == 1) {
                req.user.revision_progress = 1;
                req.user.revision_score.q1 = 1;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                res.redirect("/profile");

            }
            if (q1 == 1.5) {
                req.user.revision_progress = 1;
                req.user.revision_score.q1 = 1.5;
                req.user.save(function (err) {
                    if (err) throw err;
                });
                res.redirect("/profile");

            }
            if (q1 == 2) {

                req.flash('message', 'You just wrote gibberish! Try again');
                res.redirect("/profile");
            }
        }


    });

    router.post('/q2_revision', function(req,res){
        var code = req.body.code;


        var correct_output = new RegExp(/55/);
        var noeffort_output = new RegExp(/0/);
        var incorrect_output = new RegExp(/45/);
        var incorrect_output1 = new RegExp(/66/);


        var correct_code = new RegExp(/\(\s*\w+\s*=\s*\d+\s*;\s*\w+\s*(>|<|==|>\s*=|<\s*=|<|>)\s*\d+\s*;\s*\w+\s*\+\+\s*\)/);
        var correct_code2 = new RegExp(/\w+\s*\+\+/);

        var correct_syntax  =  correct_code.test(code);
        var correct_syntax2 = correct_code2.test(code);

        console.log(correct_syntax);
        console.log(correct_syntax2);

        req.user.revision_progress = 2;
        req.user.save(function (err) {
            if (err) throw err;
        });



        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            if(data.error) {
                console.log(data.error);
                var flow = nools.flow("Addition Program Error", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;) - Please thoroughly check your code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;) - Please thoroughly check your code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable 2", [String, "s", "s =~ /was not declared in this scope/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared. Please make sure that each variable has its appropriate variable type');
                        res.redirect("/profile");
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        req.flash('message','Something is wrong with your code please try again');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        res.send("Messed with the return statement");
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory #include./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        req.flash('message','Top curly bracket missing');
                        res.redirect("/profile");
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /at end of input/"], function (facts) {
                        req.flash('message','Bottom curly bracket missing');
                        res.redirect("/profile");
                    });
                    this.rule("Syntax Error", [String, "s", "s =~ /error: expected primary-expression/"], function (facts) {
                        req.flash('message','Seems like you messed something up. Please try again');
                        res.redirect("/profile");
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
            }

            else{
                var correct_output_conf = correct_output.test(data.output);
                var noeffort_output_conf = noeffort_output.test(data.output);
                var incorrect_output_conf = incorrect_output.test(data.output);
                var incorrect_output_conf1 = incorrect_output1.test(data.output);

                if(correct_output_conf==true){
                    if(correct_syntax==true||correct_syntax2==true){
                        req.user.revision_score.q2 = 1;
                        req.user.save(function (err) {
                            if (err) throw err;
                        });
                        res.redirect("/profile");
                    }
                    else{
                        req.user.cheating_index = 1;
                        req.user.save(function (err) {
                            if (err) throw err;
                        });
                        req.user.revision_score.q2 = 1.5;
                        req.user.save(function (err) {
                            if (err) throw err;
                        });
                        res.redirect("/profile");
                    }

                }
                if(noeffort_output_conf==true){
                    req.flash('message','Seems like you just pressed the Answer button without writing any of your own code');
                    res.redirect("/profile");

                }
                if(incorrect_output_conf==true){
                    req.user.revision_score.q2 = 2;
                    req.user.save(function (err) {
                        if (err) throw err;
                    });
                    res.redirect("/profile");


                }
                if(incorrect_output_conf1==true){
                    req.user.revision_score.q2 = 2.5;
                    req.user.save(function (err) {
                        if (err) throw err;
                    });
                    res.send("/profile");
                }
            }
        });
    });

    router.post('/q3_revision',function(req,res){
        var correct = new RegExp(/(\w+)\s*=((\s*\w+\s*[-+\/%])\s*\w+\s*)/);
        var correct1 = new RegExp(/(\w+)\s*\+\s*(\w+)/);
        var cheating = new RegExp(/(\w+\s*)=(\s*[1-9]\d{2,}|[0-9]\d)/);
        var code = req.body.code;
        var correct_result = correct.test(code);
        var correct1_result = correct1.test(code);
        var cheating_result = cheating.test(code);
        req.user.revision_progress = 3;
        req.user.save(function (err) {
            if (err) throw err;
        });



        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {

            if(data.error) {
                console.log(data.error);
                var flow = nools.flow("Addition Program Error", function (flow) {

                    this.rule("Missing Semicolon 1", [String, "s", "s =~ /error: expected ',' or ';'/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 2", [String, "s", "s =~ /error: expected ';' before/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Missing Semicolon 3", [String, "s", "s =~ /error: expected initializer/"], function (facts) {
                        req.flash('message','Your code is missing something. A semicolon! (;)');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable", [String, "s", "s =~ /error: expected . before/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared');
                        res.redirect("/profile");
                    });
                    this.rule("Undeclared variable 2", [String, "s", "s =~ /was not declared in this scope/"], function (facts) {
                        req.flash('message','Some variable seems to be undeclared. Please make sure that each variable has its appropriate variable type');
                        res.redirect("/profile");
                    });
                    this.rule("Typecasting", [String, "s", "s =~ /error: invalid conversion from/"], function (facts) {
                        res.send("Type Casting");
                    });
                    this.rule("Messed with return statement", [String, "s", "s =~ /error: return-statement with no value./"], function (facts) {
                        res.send("Messed with the return statement");
                    });
                    this.rule("Messed with #include statement 1", [String, "s", "s =~ /error: missing terminating . character/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });

                    this.rule("Messed with #include statement 2", [String, "s", "s =~ /error: 'include' does not name a type/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 3", [String, "s", "s =~ /No such file or directory/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 4", [String, "s", "s =~ /or #include stdio.h> ^/"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Messed with #include statement 5", [String, "s", "s =~ /error: invalid preprocessing directive./"], function (facts) {
                        req.flash('message','Messed with #include statement. Please DO NOT mess around with the already existing code');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 1", [String, "s", "s =~ /error: expected unqualified-id before/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 2", [String, "s", "s =~ /warning: extended initializer lists/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Missing int main() or it is in wrong position 3", [String, "s", "s =~ /token int main/"], function (facts) {
                        req.flash('message','Something is wrong with your code.I think it has something to do with your int main() function');
                        res.redirect("/profile");
                    });
                    this.rule("Top curly bracket missing", [String, "s", "s =~ /error: named return values are./"], function (facts) {
                        req.flash('message','Top curly bracket missing');
                        res.redirect("/profile");
                    });
                    this.rule("Bottom curly bracket missing", [String, "s", "s =~ /error: expect at end of input/"], function (facts) {
                        req.flash('message','Bottom curly bracket missing');
                        res.redirect("/profile");
                    });

                });
                var session = flow.getSession();

                session.assert(data.error);
                session.match();
                session.retract(data.error);
                nools.deleteFlow(flow);
            }

            else
            {
                console.log(data.output);
                if(data.output==10) {


                    console.log(correct_result);
                    console.log(correct1_result);
                    console.log(cheating_result);
                    //Correct Code
                    if((correct_result==true||correct1_result==true) && cheating_result==false){

                        res.send("Correct");
                    }
                    //Cheating Code
                    if(correct_result==true && cheating_result==true){
                        res.send("Cheater");
                    }
                    //Cheating
                    if(correct_result==false && cheating_result==true){
                        res.send("Cheater");

                    }
                    if(correct_result==false && cheating_result==false){
                        res.send("I seem to detect some form of cheating");

                    }
                }
                if(data.output !=10){
                    ans = 0.5;
                    req.flash('message','Please answer the question.');
                    res.redirect("/profile");

                }

            }
        });


    });


    /*Rules For Quiz Clasification*/
    router.post('/endofq1' , function(req,res){

        var quiz1_score = [req.user.learning_rate.application , req.user.learning_rate.definition];

        var flow = nools.flow("Quiz 1 Deficiency Classification", function (flow) {

            this.rule("No Deficiency", [Array, "n", "n[0]==1 && n[1]==2"], function (facts) {
                req.user.lesson_counter = 3;
                req.user.quiz_counter = 2;
                req.user.learning_deficiency.definition = 0;
                req.user.learning_deficiency.application = 0;
                req.user.learning_deficiency.recognition = 0;
                req.user.save(function(err){
                    if(err) throw err;
                });
            });

            this.rule("Definition Deficiency", [Array, "n", "n[0]==1 && n[1]<2"], function (facts) {
                req.user.lesson_counter = 3;
                req.user.quiz_counter = 2;

                req.user.learning_deficiency.definition = 1;
                req.user.learning_deficiency.application = 0;
                req.user.learning_deficiency.recognition = 0;
                req.user.save(function(err){
                    if(err) throw err;
                });
            });
            this.rule("Application Deficiency", [Array, "n", "n[0]>5"], function (facts) {
                req.user.lesson_counter = 3;
                req.user.quiz_counter = 2;

                req.user.learning_deficiency.definition = 0;
                req.user.learning_deficiency.application = 1;
                req.user.learning_deficiency.recognition = 0;
                req.user.save(function(err){
                    if(err) throw err;
                });
            });
            this.rule("Overall Deficiency", [Array, "n", "n[0]>5 && n[1]<2 "], function (facts) {
                req.user.lesson_counter = 3;
                req.user.quiz_counter = 2;
                req.user.learning_deficiency.definition = 1;
                req.user.learning_deficiency.application = 1;
                req.user.learning_deficiency.recognition = 1;
                req.user.save(function(err){
                    if(err) throw err;
                });
            });



        });

        var session = flow.getSession();

        session.assert(quiz1_score);
        session.match();
        session.retract(quiz1_score);
        nools.deleteFlow(flow);
        res.redirect('/profile');
    });


    /*Rule For Intermediate Evaluation*/
    router.post('/endofintermediate', function(req,res){

    });




    router.get('/lesson_1',isLoggedIn, function(req,res){
    res.render('lesson1',{user:req.user});
    });
    router.get('/another', isLoggedIn, function(req, res){
        res.render('another.ejs', {user:req.user});
    });
    router.get('/lessons',isLoggedIn, function(req, res) {
        res.render('lessons.ejs', {user:req.user});
    });
    router.get('*', function(req,res){
        res.render('404.ejs');
    });
    router.post('/compilecode' , function (req , res ) {

        var code = req.body.code.toString();
        var input = req.body.input;
        var inputRadio = req.body.inputRadio;
        var lang = req.body.lang;

        console.log(code);
        if((lang === "C") || (lang === "C++"))
        {
            if(inputRadio === "true")
            {
                var envData = { OS : "windows" , cmd : "g++"};
                compiler.compileCPPWithInput(envData , code ,input , function (data) {
                    if(data.error)
                    {
                        res.send(data.error);
                    }
                    else
                    {
                        res.send(data.output);
                    }
                });
            }
            else
            {

                var envData = { OS : "windows" , cmd : "g++"};
                compiler.compileCPP(envData , code , function (data) {
                    if(data.error)
                    {
                        res.send(data.error);
                    }
                    else
                    {
                        res.send(data.output);
                    }

                });
            }
        }
        if(lang === "Java")
        {
            if(inputRadio === "true")
            {
                var envData = { OS : "windows" };
                console.log(code);
                compiler.compileJavaWithInput( envData , code , function(data){
                    res.send(data);
                });
            }
            else
            {
                var envData = { OS : "windows" };
                console.log(code);
                compiler.compileJavaWithInput( envData , code , input ,  function(data){
                    res.send(data);
                });

            }

        }
        if( lang === "Python")
        {
            if(inputRadio === "true")
            {
                var envData = { OS : "windows"};
                compiler.compilePythonWithInput(envData , code , input , function(data){
                    res.send(data);
                });
            }
            else
            {
                var envData = { OS : "windows"};
                compiler.compilePython(envData , code , function(data){
                    res.send(data);
                });
            }
        }
        if( lang === "CS")
        {
            if(inputRadio === "true")
            {
                var envData = { OS : "windows"};
                compiler.compileCSWithInput(envData , code , input , function(data){
                    res.send(data);
                });
            }
            else
            {
                var envData = { OS : "windows"};
                compiler.compileCS(envData , code , function(data){
                    res.send(data);
                });
            }

        }
        if( lang === "VB")
        {
            if(inputRadio === "true")
            {
                var envData = { OS : "windows"};
                compiler.compileVBWithInput(envData , code , input , function(data){
                    res.send(data);
                });
            }
            else
            {
                var envData = { OS : "windows"};
                compiler.compileVB(envData , code , function(data){
                    res.send(data);
                });
            }

        }

    });

    return router;
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
};



