import { notificationModel } from "../model/notifications.js";


const createNotification = async (req,res)=>{

    try{
        const newNotif= new notificationModel({
            classId:req.body.classId,
            senderName:req.body.senderName,
            senderId:req.body.senderId,
            sendTo:req.body.sendTo,
            roleOfReceiver:req.body.roleOfReceiver,
            type:req.body.type,
            notificationString:req.body.notifString,
            dateSubmitted:req.body.dateSubmitted
        })

        newNotif.save()
        res.status(200).json(newNotif)


    }catch(err){
        res.json({error:err.message})
    }


}

const getNotifications= async(req,res)=>{


    try{
        const notifs= await notificationModel.find({classId:req.query.classId,roleOfReceiver:'Teacher'}).sort({_id:-1})
        res.status(200).json(notifs)

    }catch(err){
        res.json({error:err.message})
    }
}

const getStudentNotifs = async(req,res)=>{
    try{
        const notifs= await notificationModel.find({classId:req.query.classId, sendTo:req.query.studentId}).sort({_id:-1})
        res.status(200).json(notifs)

    }catch(err){
        res.json({error:err.message})
    }
}


export {createNotification,getNotifications,getStudentNotifs}