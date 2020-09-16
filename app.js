const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport');
var flash = require('connect-flash');
const db = require('./config/database')

const app = express();

mongoose.connect(db.mongoURI,{
    useNewUrlParser: true
}).then(()=>{
    console.log('MongoDB Connected...')
}).catch(err => console.log(err));

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars')
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'brayan',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next();
})


//Routes

//Load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

require('./config/passport')(passport);

app.get("/",(req,res) => {
    const title = 'Welcome'
    res.render('index',{
        title: title
    });
});

app.get("/about",(req,res) => {
    res.render('about');
});


//Use Routes
app.use('/ideas',ideas)
app.use('/users',users)

// const port = 5000;
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});