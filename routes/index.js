var express = require('express');
var router = express.Router();
var natural = require('natural');
var nools = require('nools');
var classifier = new natural.BayesClassifier();
var compiler = require('compilex');
var nlp = require('../nlp.js');
var option = {stats : true};
compiler.init(option);
var output = " ";
var qresonse = "";


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function(passport){

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
    req.logout();
    res.redirect('/');
  });
    router.get('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', { user: req.user, out:output, q_response:qresonse });
  });
    router.post('/profile', function(req,res){
        req.user.skill_level = req.body.skill_level;

        req.user.save(function(err){
             if(err)
                return err;
         });
        res.redirect('/profile');
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

            req.user.update({}, function(err){
                if (err){
                    return err;
                }
            });
            res.redirect('/profile')

        }
        if (req.body.feedback == "no"){



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
    router.get('/compile', function(req,res){
        res.render('compilex',{user:req.user});
    });

    router.post('/q1', function(req,res){

        var q1 = nlp.q_mainfunction(req.body.main_function);

        if(q1 == 1){
            qresonse = 1;
        }
        if(q1 == 1.5){
            qresonse = 1.5;
        }
        if(q1 == 2){
            qresonse = 2;
        }


    res.redirect('/profile');
    });


    router.post('/q3', function(req,res){
        var q3 = nlp.q_printf(req.body.printf);


        if(q3 == 1){
            qresonse = 1;
        }
        if(q3 == 1.5){
            qresonse = 1.5;
        }
        if(q3 == 2){
            qresonse = 2;
        }
        console.log(q3);
        res.redirect('/profile');






    });









    router.post('/compilecode' , function (req , res ) {


        var code = req.body.code;

        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {
            if(data.error)
            {
                res.send(data.error);
            }
            else
            {
                output = data.output
            }
        });


    });









    router.get('/fullStat' , function(req , res ){
        compiler.fullStat(function(data){
            res.send(data);
        });
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



  return router;
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }
};



