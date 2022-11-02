const exphbs = require('express-handlebars');
const express = require('express');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1:27017/akdenizyemekleri_db', {
});


app.use(expressSession({
    secret: 'test',
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/akdenizyemekleri_db' })
}))

app.use((req, res, next)=>{
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method'))

const hbs = exphbs.create({
    helpers: {
        generateDate : (date, format) => {
            return moment(date).format(format)
        }
    }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


app.use((req, res, next) =>{
   const {userId} = req.session
   if(userId) {
       res.locals = {
           displayLink: true
       }
    }
       else {
        res.locals = {  
            displayLink: false
        }
       }
       next()
   })

const main = require('./routes/main')
const posts = require('./routes/posts');
const users = require('./routes/users');
const admin = require('./routes/admin/index');
const moment = require('moment');

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)


app.listen(port, hostname, () => {
    console.log('site calisiyor')
});