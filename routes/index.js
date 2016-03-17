var express = require('express');
var router = express.Router();
var natural = require('natural');
var nools = require('nools');
var classifier = new natural.BayesClassifier();
var compiler = require('compilex');
var option = {stats : true};
compiler.init(option);

var output = " ";

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
    res.render('profile.ejs', { user: req.user, out:output });
  });router.post('/profile', function(req,res){
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

    router.post('/quiz_1', function(req,res){





        var code = req.body.code;

        var envData = { OS : "windows" , cmd : "g++"};
        compiler.compileCPP(envData , code  , function (data) {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                res.redirect('/profile');
               output = data.output;
            }
        });




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
                console.log(data.output);
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



