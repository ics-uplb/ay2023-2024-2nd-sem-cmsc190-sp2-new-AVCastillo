import mongoose from 'mongoose'

const classSchema = new mongoose.Schema({
    className:{type: String, required: true},
    section:{type:String, required:true},
    classCode:{type: String, required: true},
    teacher:{type: Array, required: false},
    student:{type:Array, required:false},
    TeacherName:{type:String, required:true},
    absenceThreshold:{type:Number, required:true}
    
})


const classModel=mongoose.model("Class", classSchema);
export{classModel};