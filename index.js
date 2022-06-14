const express = require("express");
const app = express();
const mongoose = require('mongoose');
const authRoute= require('./routes/auth');
const dotenv= require('dotenv');
const passport= require('passport')

dotenv.config();

//db connect
mongoose.connect(process.env.DB_CONNECT,()=>{
   console.log('connected to db!');
})

//Middleware
app.use(passport.initialize())
require('./authentication/loginAuth')(passport)
app.use(express.json());

app.use('/api/user',authRoute)

app.listen(3000,()=>{
    console.log('server is running on port 3000')
});