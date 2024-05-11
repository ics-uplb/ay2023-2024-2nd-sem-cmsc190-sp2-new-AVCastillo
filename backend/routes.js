import { signUP,findAll, logIn,getProfile,logOut,findUser,checkFraud,getName,getTeacherName,getSProfileDetails,editGuardianName,editPhoneNum,editGuardianContact,getTProfileDetails } from "./api/user.js";
import { createClass,getTeacherClasses,deleteClass,joinClass ,getStudentClasses,leaveClass,getStudentIds,addToClass,setThreshold,getClassThreshold,displayPeople,joinClassTeacher} from "./api/class.js";
import { createAttendance ,getAttendance,recordAttendance,modifyAttendanceField} from "./api/attendance.js";
import { createIndivAttendance,checkDuplicateAttendance,searchDisplay,editStatus,editSubmittedExcuse,getAllIndivAttendances,
    getAbsences,autoAbsent,autoAbsentClass} from "./api/indivAttendance.js";
import { displayAttendance,displayStudentAttendance,getTeacherAttendance,displayTRecords2 } from "./api/displayAttendance.js";
import { uploadexcuseLetter,getExcuseLetters,getClassExcuseLetters,getPdfName} from "./api/excuseLetter.js";
import { createNotification,getNotifications,getStudentNotifs } from "./api/notifications.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

const setUpRoutes= (app)=>{
    app.post("/api/signup",signUP);
    app.get("/api/getStudents",findAll);
    app.get("/api/getProfile",getProfile);
    app.get("/api/checkFraud",checkFraud)
    app.post("/api/login",logIn);
    app.get("/api/logout",logOut);
    app.get("/api/findUser",findUser);
    app.post("/api/createClass",createClass)
    app.get("/api/getTeacherClasses",getTeacherClasses)
    app.get("/api/getStudentClasses",getStudentClasses)
    app.delete("/api/deleteClass",deleteClass)
    app.post("/api/joinClass",joinClass)
    app.post("/api/joinClassTeacher",joinClassTeacher)
    app.post("/api/leaveClass",leaveClass)
    app.post("/api/addToClass",addToClass)
    app.post("/api/absenceThreshold",setThreshold)
    app.post("/api/createAttendance",createAttendance)
    app.post("/api/modifyAttendanceField",modifyAttendanceField)
    app.post("/api/recordAttendance",recordAttendance)
    app.get("/api/checkDuplicateAttendance",checkDuplicateAttendance)
    app.get("/api/getAttendance",getAttendance)
    app.post("/api/createIndivAttendance",createIndivAttendance)
    app.post("/api/editSubmittedExcuse",editSubmittedExcuse)
    app.get("/api/displayAttendance",displayAttendance)
    app.get("/api/displayStudentAttendance",displayStudentAttendance)
    app.get("/api/getStudIds",getStudentIds)
    app.get("/api/getTeacherAttendance",getTeacherAttendance)
    app.post("/api/searchDisplay",searchDisplay)
    app.get("/api/displayTRecords2",displayTRecords2)
    app.post("/api/uploadExcuseLetter",upload.single('pdf'),uploadexcuseLetter)
    app.get("/api/getExcuseLetters",getExcuseLetters)
    app.post("/api/editStatus",editStatus)
    app.post("/api/createNotification",createNotification)
    app.get("/api/getNotifications",getNotifications)
    app.get("/api/getStudentNotifs",getStudentNotifs)
    app.get("/api/getClassExcuseLetters",getClassExcuseLetters)
    app.get("/api/getPdfName",getPdfName)
    app.get("/api/getAllIndivAttendances",getAllIndivAttendances)
    app.get("/api/getAbsences",getAbsences)
    app.get("/api/autoAbsent",autoAbsent)
    app.get("/api/autoAbsentClass",autoAbsentClass)
    app.get("/api/getName",getName)
    app.get("/api/getTeacherName",getTeacherName)
    app.get("/api/getClassThreshold",getClassThreshold)
    app.get("/api/displayPeople",displayPeople)
    app.get("/api/getStudentDetails",getSProfileDetails)
    app.get("/api/getTeacherDetails",getTProfileDetails)
    app.post("/api/editPhoneNum",editPhoneNum)
    app.post("/api/editGuardianName",editGuardianName)
    app.post("/api/editGuardianContact",editGuardianContact)
}
export default setUpRoutes;