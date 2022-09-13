//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()


app.use(body_parser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

const url = 'mongodb://127.0.0.1:27017/USERS'
mongoose.connect(url)

const usersSchema = new mongoose.Schema({
    email:String,
    password:String
})

usersSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']})

const User = mongoose.model('users',usersSchema)

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/login',(req,res)=>{
    const email = req.body.username
    const password = req.body.password

    User.findOne({email:email},(err,foundedUser)=>{
        if(foundedUser){
            if(foundedUser.password === password){
                res.render('secrets')
            }else{
                res.redirect('/login')
            }
        }else{
            console.log(err)
        }
    })
})

app.post('/register',(req,res)=>{
    const email = req.body.username
    const password = req.body.password

    const newUser = new User({
        email:email,
        password:password
    })

    newUser.save((err)=>{
        !err
        ?res.render('secrets')
        :console.log(err)
    })
})
app.listen(3000,()=>console.log('server started at port 3000'))