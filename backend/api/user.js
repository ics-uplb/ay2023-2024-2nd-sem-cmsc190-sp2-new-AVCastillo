import mongoose from 'mongoose';
import {user} from '../model/user.js'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import dotenv from'dotenv';
dotenv.config()

// const Student= mongoose.model('Student');

const signUP= async (req,res)=>{
    const newuser=new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,  
        studentNum: req.body.studentNum,
        role: req.body.role,
        sex: req.body.sex,
        email:req.body.email,
        password: req.body.password,
        phoneNum: "",
        fraud: false,
        guardianName: "",
        guardianContact: ""
    })

    //pwede rin gamitin yung student number
    const existingEmail= await user.findOne({email:newuser.email})
    if(existingEmail){
        return res.status(400).json({error:"Email already exist!"})  //temporary solution
    }

    if (newuser.role==="Student"){
        const existingStudentNum= await user.findOne({studentNum:newuser.studentNum})
        if(existingStudentNum){
            return res.status(400).json({error:"Student number already exist!"})  //temporary solution
        }
    }



    try{
        newuser.save();
        delete newuser.password
        res.status(200).json(newuser)
    }catch(error){
        res.status(400).json({error:error.message})
    }
    
}

const logIn= async (req,res)=>{
    console.log("pasok")
    console.log(req.body)

    const {email,password}= await req.body
    const exist= await user.findOne({email: email})
    if(exist){
        console.log("pasok2")
        exist.comparePassword(password, (err,isMatch)=>{
            if(err || !isMatch){
                res.status(400).json({error:"Wrong password!"})
            }else{ //match
                const token=jwt.sign({email: exist.email, id: exist._id, role:exist.role, firstName:exist.firstName, lastName:exist.lastName},process.env.JWT_SECRET)
                let users= req.cookies.loggedInUsers

                if(exist.role==='Student'){
                    if(users){
                        users.push(exist._id)
                        res.cookie("loggedInUsers",users)
                    }else{
                        res.cookie("loggedInUsers",[exist._id])
                    }
                }
                res.cookie("token",token,{
                    httpOnly:true,
                    secure:true,
                    sameSite:"None",
                    maxAge:3600000}).json(exist)
               
            }

            
        })

    }else{
        res.status(400).json({error:"Email not registered!"})
    }

   

}

const getProfile= async(req,res)=>{
    try{
        console.log(req.cookies)
        const token=  await req.cookies.token
        console.log(token)
        if(token){
        jwt.verify(token, process.env.JWT_SECRET,{},(err,user)=>{
                if(err){
                    res.json(err);
                }else{
                    res.json(user)
                }
            })

        }else{
            res.send(null)
        }
    }catch(err){
        res.json({error:err.message})
    }
    
}

const getSProfileDetails =async(req,res)=>{
    try{
        const details= await user.findOne({_id:req.query.id})
        const arrDeets= [`${details.firstName} ${details.lastName}`, details.email, details.studentNum, details.sex, details.phoneNum, details.guardianName, details.guardianContact]
        res.status(200).json({details:arrDeets})
    }catch(err){
        res.json({error:err.message})
    }
}

const getTProfileDetails =async(req,res)=>{
    try{
        const details= await user.findOne({_id:req.query.id})
        const arrDeets= [`${details.firstName} ${details.lastName}`, details.email, details.sex]
        res.status(200).json({details:arrDeets})
    }catch(err){
        res.json({error:err.message})
    }
}

const checkFraud= async(req,res)=>{
    try{
        
        const loggedInUsers= await req.cookies.loggedInUsers
        const checkRole= await user.findOne({_id:req.query.studentId})
        let isFraud=false
        let uniqueArray=''
        if(loggedInUsers){
            if(!(loggedInUsers.every(element=>element===req.query.studentId))){
                isFraud=true
                uniqueArray = Array.from(new Set(loggedInUsers));
            }
                
            
            res.status(200).json({fraud:isFraud, peopleInvolved:uniqueArray})
        }else{
            res.status(200).json({fraud:false,peopleInvolved:[]})
        }

    }catch(err){
        res.json({error:err.message})
    }
}

const logOut = async(req,res)=>{
    res.cookie('token','',{maxAge:1}).json({message:"Logged out"})
}

const findUser= async(req,res)=>{

    try{
        
        const data= await user.findById(req.query.id)
        if(data){
            res.status(200).json(data)
    
        }else{
            res.status(404).json({error:"Does not exist"})
        }
    }catch(e){
        res.json({message:err.message})
    }
    
    
    
    

}

const findAll= async(req,res)=>{
    const studs= await user.find()
    res.status(200).json(studs)

}

const getName=async(req,res)=>{
    try{
        const name= await user.findOne({_id:req.query.studentId})
        
        res.status(200).json({name:`${name.lastName} ${((name.firstName))}`})

    }catch(err){
        res.json({error:err.message})
    }
}


const getTeacherName=async(req,res)=>{
    try{
        const name= await user.findOne({_id:req.query.teacherId})
        res.status(200).json({name:`${name.firstName} ${((name.lastName))}`})

    }catch(err){
        res.json({error:err.message})
    }

}


const editPhoneNum=async(req,res)=>{
    try{
        const phoneNum= await user.findOneAndUpdate({_id:req.body.id},{phoneNum:req.body.phoneNum},{new:true})
        res.status(200).json(phoneNum)

    }catch(err){
        res.json({error:err.message})
    }
}


const editGuardianName=async(req,res)=>{
    try{
        const guardianName= await user.findOneAndUpdate({_id:req.body.id},{guardianName:req.body.guardianName},{new:true})
        res.status(200).json(guardianName)

    }catch(err){
        res.json({error:err.message})
    }
}

const editGuardianContact=async(req,res)=>{
    try{
        const guardianContact= await user.findOneAndUpdate({_id:req.body.id},{guardianContact:req.body.guardianContact},{new:true})
        res.status(200).json(guardianContact)

    }catch(err){
        res.json({error:err.message})
    }
}

export{signUP,findAll,logIn,getProfile,logOut,findUser,checkFraud,getName,getTeacherName,getSProfileDetails,editPhoneNum,editGuardianName,editGuardianContact,getTProfileDetails}