import mongoose from 'mongoose'


const indivAttendanceSchema = new mongoose.Schema({

    studentId:{type: String, required: true},
    attendanceCollectionId:{type:String, required:true},
    classId:{type:String, required:true},
    status:{type: String, required: true},
    date:{type: String, required: false},
    searchDate:{type:String, required:true},
    name:{type:String,required:true},
    submittedExcuse:{type:Boolean,required:true},
    location:{type: String, required: false},

    
    
})



const indivAttendanceModel=mongoose.model("indivAttendance", indivAttendanceSchema);
export{indivAttendanceModel};