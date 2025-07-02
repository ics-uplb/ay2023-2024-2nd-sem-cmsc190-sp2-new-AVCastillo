import { attendanceModel } from "../model/attendance.js";
import { indivAttendanceModel } from "../model/indivAttendance.js";
const createAttendance= async(req,res)=>{

    const newAttendance= new attendanceModel({
        classId: req.body.classId,
        startSched: req.body.startSched,
        endSched: req.body.endSched,
        
    })

    try{
        newAttendance.save();
        res.status(200).json(newAttendance)
    }catch(error){
        res.status(404).json({error:error.message})
    }
    
}

const modifyAttendanceField=async(req,res)=>{
    try{
        const modified= await attendanceModel.findOneAndUpdate({_id:req.body.attendanceId}, {attendance:req.body.indivIds},{new:true})
        res.status(200).json(modified)

    }catch(err){
        res.json({error:err.message})
    }
}

const getAttendance = async(req,res)=>{//container
    try{
        const attendance= await attendanceModel.findOne({_id:req.query.attendanceId})
        res.status(200).json(attendance)
    }catch(e){
        res.json({error:err.message})
    }
    
}


const recordAttendance=async(req,res)=>{
    
    try{
        console.log(req.body.attendanceCollectionId,req.body.studentId)
        const update= await indivAttendanceModel.findOneAndUpdate({attendanceCollectionId:req.body.attendanceCollectionId, studentId:req.body.studentId },{status:req.body.status, date: req.body.date, location:req.body.location},{new:true})
        console.log(update)
        
        res.status(200).json(update)
            
  
    }catch(e){
        res.status(400).json({error:e})
        
    }
    
}


export {createAttendance,getAttendance,recordAttendance,modifyAttendanceField}