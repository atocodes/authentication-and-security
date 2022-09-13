//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRound = 10
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
            bcrypt.compare(password, foundedUser.password,(err,result)=>{
                if(result)res.render('secrets')
            })
        }else{
            console.log(err)
        }
    })
})

app.post('/register',(req,res)=>{
    const email = req.body.username
    const password = req.body.password

    bcrypt.hash(password,saltRound,(err,hash)=>{
        
        const newUser = new User({
            email:email,
            password:hash
        })
    
        newUser.save((err)=>{
            !err
            ?res.render('secrets')
            :console.log(err)
        })
    })

})
app.listen(3000,()=>console.log('server started at port 3000'))