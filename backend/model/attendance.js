import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({

    classId:{type: String, required: true},
    startSched:{type:String, required:true},
    endSched:{type:String, required:true},
    
})


const attendanceModel=mongoose.model("Attendance", attendanceSchema);
export{attendanceModel};