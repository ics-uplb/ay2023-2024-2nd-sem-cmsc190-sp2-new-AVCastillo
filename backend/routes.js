import { signUP,findAll, logIn,getProfile,logOut,findUser,checkFraud,getName,getTeacherName,getSProfileDetails,editGuardianName,editPhoneNum,editGuardianContact,getTProfileDetails } from "./api/user.js";
import { createClass,getTeacherClasses,deleteClass,joinClass ,getStudentClasses,leaveClass,getStudentIds,addToClass,setThreshold,getClassThreshold,displayPeople,joinClassTeacher} from "./api/class.js";
import { createAttendance ,getAttendance,recordAttendance,modifyAttendanceField} from "./api/attendance.js";
import { createIndivAttendance,checkDuplicateAttendance,searchDisplay,editStatus,editSubmittedExcuse,getAllIndivAttendances,
    getAbsences,autoAbsent,autoAbsentClass} from "./api/indivAttendance.js";
import { displayAttendance,displayStudentAttendance,getTeacherAttendance,displayTRecords2 } from "./api/displayAttendance.js";
import { uploadexcuseLetter,getExcuseLetters,getClassExcuseLetters,getPdfName} from "./api/excuseLetter.js";
import { createNotification,getNotifications,getStudentNotifs } from "./api/notifications.js";
import multer from "multer";
import express from 'express'
import cors from 'cors'

const router=express.Router()
router.use(
    cors({
        origin:"https://uplbattedancetracker.vercel.app", //vercel url
        credentials:true,
        methods:["GET","POST"]
    })
)


const upload = multer({ dest: 'uploads/' });

router.post("/api/signup",signUP);
router.get("/api/getStudents",findAll);
router.get("/api/getProfile",getProfile);
router.get("/api/checkFraud",checkFraud)
router.post("/api/login",logIn);
router.get("/api/logout",logOut);
router.get("/api/findUser",findUser);
router.post("/api/createClass",createClass)
router.get("/api/getTeacherClasses",getTeacherClasses)
router.get("/api/getStudentClasses",getStudentClasses)
router.delete("/api/deleteClass",deleteClass)
router.post("/api/joinClass",joinClass)
router.post("/api/joinClassTeacher",joinClassTeacher)
router.post("/api/leaveClass",leaveClass)
router.post("/api/addToClass",addToClass)
router.post("/api/absenceThreshold",setThreshold)
router.post("/api/createAttendance",createAttendance)
router.post("/api/modifyAttendanceField",modifyAttendanceField)
router.post("/api/recordAttendance",recordAttendance)
router.get("/api/checkDuplicateAttendance",checkDuplicateAttendance)
router.get("/api/getAttendance",getAttendance)
router.post("/api/createIndivAttendance",createIndivAttendance)
router.post("/api/editSubmittedExcuse",editSubmittedExcuse)
router.get("/api/displayAttendance",displayAttendance)
router.get("/api/displayStudentAttendance",displayStudentAttendance)
router.get("/api/getStudIds",getStudentIds)
router.get("/api/getTeacherAttendance",getTeacherAttendance)
router.post("/api/searchDisplay",searchDisplay)
router.get("/api/displayTRecords2",displayTRecords2)
router.post("/api/uploadExcuseLetter",upload.single('pdf'),uploadexcuseLetter)
router.get("/api/getExcuseLetters",getExcuseLetters)
router.post("/api/editStatus",editStatus)
router.post("/api/createNotification",createNotification)
router.get("/api/getNotifications",getNotifications)
router.get("/api/getStudentNotifs",getStudentNotifs)
router.get("/api/getClassExcuseLetters",getClassExcuseLetters)
router.get("/api/getPdfName",getPdfName)
router.get("/api/getAllIndivAttendances",getAllIndivAttendances)
router.get("/api/getAbsences",getAbsences)
router.get("/api/autoAbsent",autoAbsent)
router.get("/api/autoAbsentClass",autoAbsentClass)
router.get("/api/getName",getName)
router.get("/api/getTeacherName",getTeacherName)
router.get("/api/getClassThreshold",getClassThreshold)
router.get("/api/displayPeople",displayPeople)
router.get("/api/getStudentDetails",getSProfileDetails)
router.get("/api/getTeacherDetails",getTProfileDetails)
router.post("/api/editPhoneNum",editPhoneNum)
router.post("/api/editGuardianName",editGuardianName)
router.post("/api/editGuardianContact",editGuardianContact)

export default router;