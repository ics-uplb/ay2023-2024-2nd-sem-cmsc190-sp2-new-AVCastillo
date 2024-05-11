import { indivAttendanceModel } from "../model/indivAttendance.js";
import { attendanceModel } from "../model/attendance.js";
import { user } from "../model/user.js";



const createIndivAttendance=async(req,res)=>{

   
    try{
        for(const id of req.body.studentIds){
            const name = await user.findOne({_id:id})
            const newIndivAttendance= new indivAttendanceModel({
                studentId: id,
                attendanceCollectionId:req.body.attendanceCollectionId,
                classId:req.body.classId,
                status: "Not Yet Scanned",
                date: '',
                searchDate:req.body.searchDate,
                location:'',
                submittedExcuse:false,
                name: (name.lastName + " " + (name.firstName)[0] +".")
                
            });
            
    
            newIndivAttendance.save()
            
        }
        res.status(200).json({message:"success"})

        
    }catch(error){
        res.json({error:error.message})
    }


}


const checkDuplicateAttendance=async(req,res)=>{
    try{
        
        const attendance= await indivAttendanceModel.findOne({attendanceCollectionId:req.query.attendanceCollectionId,studentId:req.query.studentId, status:{$ne:'Not Yet Scanned'}})
        res.status(200).json(attendance)
        
    }catch(e){
        res.json({error:err.message})
    }

}

const searchDisplay=async(req,res)=>{

    try{
        const search= await indivAttendanceModel.find({classId:req.body.classId, searchDate:req.body.searchDate}) //, searchDate:{$eq:req.body.searchDate}

        res.status(200).json(search)
    }catch(err){
        res.json({error:err.message})
    }
   

}


const editStatus= async(req,res)=>{

    try{
        const edit =await indivAttendanceModel.findOneAndUpdate({studentId:req.body.indivId,attendanceCollectionId:req.body.attendanceCollectionId},{status:req.body.updatedStatus},{new:true})
        res.status(200).json(edit)

    }catch(err){
        res.json({error:err.message})
    }
}

const editSubmittedExcuse= async(req,res)=>{


    try{
        const submitted= await indivAttendanceModel.findByIdAndUpdate({_id:req.body.indivAttendanceId},{submittedExcuse:req.body.submitted},{new:true})
        res.status(200).json(submitted)

    }catch(err){
        res.json({error:err.message})
    }
}

const getAllIndivAttendances= async(req,res)=>{
    try{
        const indivs= await indivAttendanceModel.find({submittedExcuse:true, classId:req})
        res.status(200).json(indivs.reverse())
    }catch(err){
        res.json({error:err.message})
    }
}


const getAbsences=async (req,res)=>{
    try{   
        const absence= await indivAttendanceModel.find({classId:req.query.classId, studentId:req.query.studentId, $or:[{status:"Absent"},{status:"Not Yet Scanned"}]})
        res.status(200).json(absence)


    }catch(err){
        res.json({error:err.message})
    }
}

const autoAbsent=async (req,res)=>{
    try{   
        const pending= await indivAttendanceModel.find({classId:req.query.classId, studentId:req.query.studentId,status:"Not Yet Scanned"})
        for(const data of pending){
            const collectionId=data.attendanceCollectionId
            const attendance= await attendanceModel.findOne({_id:collectionId})
            const date= new Date(attendance.endSched)
            const now= new Date()
            if(now>date){
                const auto= await indivAttendanceModel.findOneAndUpdate({attendanceCollectionId:collectionId, studentId:req.query.studentId},{status:"Absent"},{new:true})
            }
        }



        res.status(200).json(pending)


    }catch(err){
        res.json({error:err.message})
    }
}

const autoAbsentClass=async (req,res)=>{
    try{   
        const pending= await indivAttendanceModel.find({classId:req.query.classId,status:"Not Yet Scanned"})
        for(const data of pending){
            const collectionId=data.attendanceCollectionId
            const attendance= await attendanceModel.findOne({_id:collectionId})
            const date= new Date(attendance.endSched)
            const now= new Date()
            if(now>date){
                const auto= await indivAttendanceModel.findOneAndUpdate({attendanceCollectionId:collectionId, studentId:data.studentId},{status:"Absent"},{new:true})
            }
        }



        res.status(200).json(pending)


    }catch(err){
        res.json({error:err.message})
    }
}


export {createIndivAttendance,checkDuplicateAttendance,searchDisplay,editStatus,editSubmittedExcuse,getAllIndivAttendances,getAbsences,autoAbsent,autoAbsentClass}