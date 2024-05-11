import mongoose from 'mongoose'

const excuseSchema= new mongoose.Schema({

    name:{type:String,required:true},
    file:{type:Buffer, required:true},
    sendTo:{type:String, required:true},
    sender:{type:String, required:true},
    indivAttendanceId:{type:String, required:true},
    dateSubmitted:{type:String, required:true}

})


const excuseModel= mongoose.model('EXCUSE',excuseSchema)
export {excuseModel}