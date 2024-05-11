import mongoose, { mongo } from 'mongoose'


const notificationSchema= new mongoose.Schema({
    classId: {type:String, required:false},
    senderName: {type:String, required:false},
    senderId: {type:String, required:false},
    sendTo:{type:String,required:false},
    roleOfReceiver:{type:String,required:true},
    type:{type:String,required:true},
    notificationString: {type:String, required:false},
    dateSubmitted: {type:String, required:false}
})




const notificationModel= mongoose.model('notification',notificationSchema)

export {notificationModel}