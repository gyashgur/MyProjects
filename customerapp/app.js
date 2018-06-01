
//console.log('Hello World');

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp',['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

/*
var logger = function(req, res, next){
    console.log('Logging.... ');
    next();
}

app.use(logger);   // before route handler
*/

// View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//BodyParser Middleware

app.use(bodyparser.json(0));
app.use(bodyparser.urlencoded({extended:false}));

// Set Static path
app.use(express.static(path.join(__dirname,'public')));

// Global vars

app.use(function(req, res, next){
   res.locals.errors = null;
   next();
});

// Express Validator Middleware

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

/*
var person = {
    name: 'Jeff',
    age: 30
};

app.get('/',function(req,res){
    res.json(person);
})



var people = [
     {
        name: 'Jeff',
        age: 30
    },
    {
        name: 'Sara',
        age: 22
    },
    {
        name: 'Bill',
        age: 40
    }
];


app.get('/',function(req,res){
    res.json(people);
})

*/

/*
var users = [
    {     
          id: 1,
          first_name: 'John',
          last_name:  'Doe',
          email: 'joedoe@gmail.com'
    },
    {     
        id: 2,
        first_name: 'Bob',
        last_name:  'Smith',
        email: 'bobsmith@gmail.com'
   },
   {     
        id: 3,
        first_name: 'Jill',
        last_name:  'Jackson',
        email:     'jjackson@gmail.com'
   }    

];
*/
app.get('/', function(req, res){
    // res.send('Hello world ');
    // var title = 'Customers';
        db.users.find(function(err,docs){
        console.log(docs);
        res.render('index',{
            title: 'Customer',
            users: docs
         });
    })
 });

 app.post('/users/add',function(req, res){
        req.checkBody('first_name','First name is required').notEmpty();
        req.checkBody('last_name','Last name is required').notEmpty();
        req.checkBody('email','email is required').notEmpty();

        var errors = req.validationErrors();

        // console.log('FORM SUBMITTED');
        // console.log(req.body.first_name);

        if(errors){
            // console.log('ERRORS');
            res.render('index',{
                title: 'Customer',
                users: users,
                errors: errors
              });

        } else {
            var newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }
            //console.log('SUCCESS');
            db.users.insert(newUser,function(err,result){
                if(err){
                  console.log(err);
                }
                res.redirect('/');

            });
        }



        console.log(newUser);
 });
 
 app.delete('/users/delete/:id',function(req,res){
     db.users.remove({_id: ObjectId(req.params.id)},function(err,result){})
     if(err){
         console.log(err);
     }
     res.redirect('/');
 });

app.listen(3000, function(){
    console.log('Server Started on Port 3000...');
});

