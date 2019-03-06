const express = require('express');
const mongoose = require('mongoose')
const app = express();
const bodyParser= require('body-parser')
//import routes
const auth = require('./routers/auth')
const post = require('./routers/post')
const profile = require('./routers/profile')

const passport = require('passport')




//apply bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '50mb'}))

app.use(passport.initialize());

//passport config
require('./middleware/check-auth')(passport)


app.use(express.static('uploads'));

//DB config
const db = require('./config/keys').MongoURI;


//connect to db
mongoose.connect(db)
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.log(err))





app.get('/', (req, res)=> {
    res.json({msg:'It works'})
})

app.get('/hey', (req, res)=> {
    res.json({msg:'It works hopefully'})
})
app.get('/testinapp', (req, res)=> {
    res.json({message:'TestInApp'})
})


app.use('/api/auth', auth)
app.use('/api/post', post)
app.use('/api/profile', profile)

//use routes
//app.use('/api/auth', auth)

const port = process.env.PORT || 3001

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`)
})