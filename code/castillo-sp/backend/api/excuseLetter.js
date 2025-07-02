import { excuseModel } from "../model/excuseLetter.js"
import fs from 'fs'

const uploadexcuseLetter = async(req,res)=>{
    try {
        const file = req.file;
        const excuseLetter = new excuseModel({
            name: file.originalname,
            file: fs.readFileSync(file.path),
            sendTo:req.body.classId,
            sender:req.body.studentId,
            indivAttendanceId:req.body.indivAttendanceId,
            dateSubmitted:req.body.dateSubmitted

            
        });
        await excuseLetter.save();
        res.send('excuse letter file uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading excuse letter file');
    }
}


const getExcuseLetters=async(req,res)=>{
    try {
        const pdf = await excuseModel.findOne({indivAttendanceId:req.query.indivAttendanceId});
        if (!pdf) return res.status(404).send('PDF not found');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdf.file);
      } catch (error) {
        res.status(500).send('Error fetching PDF');
      }
}


const getClassExcuseLetters=async(req,res)=>{
    try {
            const pdf = await excuseModel.findOne({indivAttendanceId:req.query.indivAttendanceId});
            if(pdf){
                res.setHeader('Content-Type', 'application/pdf');
                res.send(pdf.file);
            }else{
                res.send(pdf)
            }
      } catch (error) {
        res.status(500).send('Error fetching PDF');
      }
}

const getPdfName= async(req,res)=>{
    try {
        const pdfName = await excuseModel.findOne({indivAttendanceId:req.query.indivAttendanceId},"name dateSubmitted");
        res.status(200).json(pdfName)
    } catch (error) {
        res.status(500).send('Error fetching PDF');
    }
}

export {uploadexcuseLetter,getExcuseLetters,getClassExcuseLetters,getPdfName}