//importing required module 
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const cors=require('cors')
const User=require('./models/User')
const bcrypt=require('bcryptjs')


//middlewares
const app=express()
app.use(cors());
app.use(express.json());
const PORT=5000


mongoose.connect(process.env.MONGO_URI).then(
    ()=>console.log('db connected....')


).catch(
    (err)=>console.log(err)
)


//register api

app.post('/register',async(req,res)=>{
    const{username,email,password}=req.body
    try{
      const hashedPassword=await bcrypt.hash(password,10)
      const user=new User({username,email,password:hashedPassword})
      await user.save()
      res.json({message:"User Registered.."})
      console.log("User Registration completed")
    }
    catch(err){
        console.log(err)

    }
})


//login api
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({email})
        if(!user || !(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({message:"Invalid credentials"})
        }
        res.json({message:"Logim successful",username:user.username})


    }
    catch(err){
        console.log(err)

    } 
})

//connecting server
app.listen(PORT,()=> console.log('server is running'));