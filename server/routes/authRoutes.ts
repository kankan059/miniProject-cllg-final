import bcrypt from 'bcryptjs'
import express, { Router } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
//test
router.get("/test", (req, res) => {
  res.json({ message: " route working!" });
});
//register
router.post('/signup' , async (req , res)=>{
    try{
        const {name , email , password} = req.body;
        const existance = await User.findOne({email});
        if(existance) return res.status(400).json({message : "user is already exit"});

        const hased = await bcrypt.hash(password , 10);
        const user = new User({name , email , password : hased})
        await user.save();

        res.status(201).json({message : "user registered successfully!!!!!!"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : "server error beta"});
    }
})


//Login 
router.post('/login' , async(req, res)=>{
    try{
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message : "user invalid"});
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) return res.status(400).json({message : "invalid carendtials"})


        const token = jwt.sign({id: user._id , role : user.role} , process.env.JWT_SECRET! , {expiresIn : "7d"} ) 
        res.json({token, user});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : "server problem"})
    }
})


export default router;