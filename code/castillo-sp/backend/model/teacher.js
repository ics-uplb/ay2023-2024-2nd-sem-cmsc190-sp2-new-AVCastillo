import mongoose from 'mongoose';


const teacherSchema = new mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    birthday: {type: String, required:true}, //temporary
    sex: {type: String, required:true},
    username: {type: String, required:true},
    password: {type: String, required:true},
   
})


mongoose.model("teacher", studentSchema);