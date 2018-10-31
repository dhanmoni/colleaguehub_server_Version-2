const express = require('express');
const mongoose = require('mongoose')
const app = express();
const bodyParser= require('body-parser')
//import routes
const auth = require('./routers/auth')
const passport = require('passport')

//apply bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());


//DB config
const db = require('./config/keys').MongoURI;



//connect to db
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.log(err))

app.get('/', (req, res)=> {
    res.json({msg:'It works'})
})

//use routes
app.use('/auth', auth)

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`Server started on post ${port}`)
})