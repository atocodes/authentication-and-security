//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const app = express()


app.use(body_parser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(session({
    secret:'out little secret.',
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

const url = 'mongodb://127.0.0.1:27017/USERS'
mongoose.connect(url)

const usersSchema = new mongoose.Schema({
    email:String,
    password:String
})

usersSchema.plugin(passportLocalMongoose)

const User = mongoose.model('users',usersSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/secrets',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('secrets')
    }else{
        res.redirect('/login')
    }
})

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })  
})

app.post('/login',(req,res)=>{
    
    const newUser = new User({
        username: req.body.username,
        passowrd: req.body.password
    })
    
    req.login(newUser,(err)=>{
        if(err){
            console.log(err)
            res.redirect('/login')
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets')
            })
        }
    })
})

app.post('/register',(req,res)=>{
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
        if(err){
            console.log(err)
            res.redirect('/register')
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets')
            })
        }
    })
    
})
app.listen(3000,()=>console.log('server started at port 3000'))