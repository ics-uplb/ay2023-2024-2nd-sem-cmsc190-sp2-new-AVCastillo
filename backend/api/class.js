import { classModel } from "../model/class.js"
import { user } from "../model/user.js";

const createClass= async(req,res)=>{

    const newClass= new classModel({
        className: req.body.className,
        section:req.body.section,
        classCode: req.body.classCode,
        teacher: req.body.teacherId,
        students:[],
        TeacherName:req.body.teacherName,
        absenceThreshold:6
    })


    try{
        newClass.save();
        res.status(200).json(newClass)
    }catch(error){
        res.status(404).json({error:error.message})
    }
    
}


//Own classes
const getTeacherClasses= async(req,res)=>{
    try{
        const teacherClass= await classModel.find({teacher:{$elemMatch:{$eq:req.query.teacherId}}})
        res.status(200).json(teacherClass)
    }catch(e){
        res.status(404).json({error:error.message})
    }
}

const getStudentClasses= async(req,res)=>{
    try{
        const studentClass= await classModel.find({student:{$elemMatch:{$eq:req.query.studentId}}})
        res.status(200).json(studentClass)
    }catch(e){
        res.status(404).json({error:error.message})
    }
}

const deleteClass= async(req,res)=>{
    
    try{
        const toDelete= await classModel.deleteOne({_id:req.query.id})

        res.status(200).json(toDelete)
    }catch(err){
        res.status(400).json({error:err.message})
    }
}


//student
const joinClass=async(req,res)=>{
    try{
        const findCode=await classModel.findOne({classCode:req.body.code})
        
        if(findCode){
            const findStud=  await classModel.findOne({classCode:req.body.code, student:{$elemMatch:{$eq:req.body.studentId}}})
            
            if(findStud){
                res.json({error:"User already in class"})
            }else{
                const joinToClass=await classModel.findOneAndUpdate({classCode:req.body.code}, {$push:{student:req.body.studentId}},{new:true})
                    res.status(200).json(joinToClass)
            
            }
        }else{
            res.json({error:"Class does not exist"})
        }
    }catch(e){
        res.status(400).json({error:e})
    }
    
}

const joinClassTeacher=async(req,res)=>{
    try{
        const findCode=await classModel.findOne({classCode:req.body.code})
        
        if(findCode){
            const findStud=  await classModel.findOne({classCode:req.body.code, teacher:{$elemMatch:{$eq:req.body.teacherId}}})
            
            if(findStud){
                res.json({error:"User already in class"})
            }else{
                const joinToClass=await classModel.findOneAndUpdate({classCode:req.body.code}, {$push:{teacher:req.body.teacherId}},{new:true})
                    res.status(200).json(joinToClass)
            
            }
        }else{
            res.json({error:"Class does not exist"})
        }
    }catch(e){
        res.status(400).json({error:e})
    }
    
}




const leaveClass=async(req,res)=>{
    try{
        

        const leaveClass=await classModel.findOneAndUpdate({classCode:req.body.code}, {$pull:{student:req.body.studentId}},{new:true})
        res.status(200).json(leaveClass)
        
        
        
    }catch(e){
        res.status(400).json({error:e})
    }
    
}

//teacher
// const joinClassTeacher=async(req,res)=>{
//     await classModel.findOneAndUpdate({classCode:req.body.code}, {$push:{teacher:req.body.teacherId}},{new:true})
// }

const addToClass=async(req,res)=>{

    try{
        const findUser= await user.findOne({email:req.body.email})
        if(findUser){
            if(findUser.role==='Student'){
                const existing= await classModel.findOne({_id:req.body.classId, student:{$elemMatch:{$eq:findUser._id.toString()}}})
                if(!existing){
                    const add=await classModel.findOneAndUpdate({_id:req.body.classId},{$push:{student:findUser._id.toString()}},{new:true})
                    res.status(200).json(add)
                }else{
                    res.json({error:"Student already in class!"})
                }
            }else{
                const existing= await classModel.findOne({_id:req.body.classId, teacher:{$elemMatch:{$eq:findUser._id.toString()}}})
                if(!existing){
                    const add=await classModel.findOneAndUpdate({_id:req.body.classId},{$push:{teacher:findUser._id.toString()}})
                    res.status(200).json(add)
                }else{
                    res.json({error:"Teacher already in class!"})
                }
            }
        }else{
            res.json({error:"user does not exist!"})
        }
        
    }catch(err){
        res.json({error:err.message})
    }
}

const getStudentIds= async(req,res)=>{
    try{

        const studs= await classModel.findOne({_id:req.query.classId},'student')
        res.status(200).json(studs.student)

    }catch(err){
        res.json({error:err.message})
    }
}

const displayPeople=async(req,res)=>{
    try{
        const studs= await classModel.findOne({_id:req.query.classId},'student')
        const teachers=await classModel.findOne({_id:req.query.classId},'teacher')
        
        let people=[]

        for(const id of studs.student){
            const person= await user.findOne({_id:id})
            people.push(person)
        }
        for(const id of teachers.teacher){
            const person= await user.findOne({_id:id})
            people.push(person)
        }

        res.status(200).json({people:people})

    }catch(err){
        res.json({error:err.error})
    }
}

const setThreshold=async(req,res)=>{

    try{
        const threshold= await classModel.findOneAndUpdate({_id:req.body.classId},{$set:{absenceThreshold:Number(req.body.threshold)}},{new:true})
        
        res.status(200).json(threshold)

    }catch(err){
        res.json({error:err.message})
    }
}

const getClassThreshold= async(req,res)=>{
    try{
        const threshold= await classModel.findOne({_id:req.query.classId})
        res.status(200).json({threshold:threshold.absenceThreshold})

    }catch(err){
        res.json({error:err.message})
    }
}



export {createClass,getTeacherClasses,getStudentClasses,deleteClass,joinClass,leaveClass,getStudentIds,addToClass,setThreshold,getClassThreshold,displayPeople,joinClassTeacher}