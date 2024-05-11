import { indivAttendanceModel } from "../model/indivAttendance.js";
import { attendanceModel } from "../model/attendance.js";
import { classModel } from "../model/class.js";



const displayAttendance= async(req,res)=>{ //papalitan

    try{
        const attendance= await attendanceModel.find({classId: req.query.classId},'attendance')

        let temp=[]
        for (const indiv of attendance){
            let temp2=[]
           for(const id of indiv.attendance){
            const holder= await indivAttendanceModel.findOne({_id:id})
            temp2.push(holder)

           }
           temp.push(temp2)
        }
        res.json(temp)
       

    }catch(err){
        res.json({error:err.message})
    }


}

const displayStudentAttendance= async (req,res)=>{

    try{
        const classes= await indivAttendanceModel.find({studentId:req.query.studentId, classId:req.query.classId})
        res.status(200).json(classes.reverse())


    }catch(err){
        res.json({error:err.message})
    }
}

const getTeacherAttendance=async(req,res)=>{
    try{
        const attendance= await attendanceModel.find({classId: req.query.classId},"startSched")
        let temp=[]

        for(const att of attendance){
            temp.push(att.startSched)
        }
        
        
        const reversed=temp.reverse()
       
        res.status(200).json({dates:reversed})

    }catch(err){
        res.json({error:err.message})
    }
}


const displayTRecords2=async(req,res)=>{

    try{
        const students= await classModel.findOne({_id: req.query.classId})
      

        let temp=[]
        for (const student of students.student){
            const indiv= await indivAttendanceModel.find({studentId:student, classId:req.query.classId})
            temp.push(indiv.reverse())
        }

        res.status(200).json({attendance:temp, className:students.className,section:students.section})
    }catch(err){
        res.json({error:err.message})
    }

   
    


}
export {displayAttendance,displayStudentAttendance,getTeacherAttendance,displayTRecords2}



