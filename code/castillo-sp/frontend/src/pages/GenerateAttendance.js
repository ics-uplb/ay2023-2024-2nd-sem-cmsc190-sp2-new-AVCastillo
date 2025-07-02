import {useState}from 'react';
import QRCode from 'qrcode';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {Box,Button,Typography,Grid,Dialog,Stack} from '@mui/material'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';





const GenerateAttendance=()=>{

    const [url,setUrl]=useState('');
    const [qrcode, setQrcode]=useState('')
    // const [attendanceId, setAttendanceId]=useState('')
    const {classId}=useParams()
    const [startTime,setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [openD, setOpenD] = useState(false);
    const [snackbarLabel,setSnackbarLabel]=useState('')
    const [openSnack, setOpenSnack]=useState(false)
    const [success,setSuccess]=useState('')
    const [downloadName,setDownloadName]=useState(null)

    const today = new Date(); // Get today's date
    const currentTime = new Date(); // Get current time

    // Set minimum selectable date to today
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Set minimum selectable time to current time
    const minTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes());


    const createAttendance= async ()=>{
        if(startTime && endTime){

            const students=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getStudIds?classId=${classId}`,{withCredentials:true})
            const created= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/createAttendance`,{classId:classId,startSched:startTime.toString(),endSched:endTime.toString()},{withCredentials:true})
            const indiv= await  axios.post(`${process.env.REACT_APP_API_SERVER}/api/createIndivAttendance`,{classId:classId,studentIds:students.data,attendanceCollectionId:created.data._id,searchDate:created.data.startSched},{withCredentials:true})
        
        
            generateQR(created.data._id)
        }else{
            setOpenSnack(true)
            setSnackbarLabel('Select schedule first')
            setSuccess('error')
        }
        
    }

    const generateQR=(attendanceId)=>{


        QRCode.toDataURL(attendanceId,{
            width:300,
            margin:2,
            color:{
                
            }
        },(err,attendanceId)=>{
            if(err){
                throw err
            }
            setQrcode(attendanceId)
        })


        setDownloadName(startTime)
        setEndTime(null)
        setStartTime(null)
    }

    const handleClickOpen = () => {
        setOpenD(true);
      };
    
      const handleClose = () => {
        setOpenD(false);
      };

      const closeSnackbar=()=>{
        setOpenSnack(false)
      }
    

    return(
        <>
       
      <Grid sx={{paddingTop:3,justifyContent:"center" ,alignItems:"center"}}columns={{xs:6, sm:8, md:12, lg:16}}   container>
        
        <Grid sx={{paddingBottom:3}} xs={6} sm={8} md={12} lg={16} item> 
            <Typography variant='h5' sx={{fontWeight:'bold'}}>
                Schedule your class
            </Typography>
        </Grid>

        <Grid  xs={6} sm={8} md={12} lg={16} item>
            {/* <Button onClick={handleClickOpen} >Set Date</Button> */}
            <Box >
            <Typography>Start time</Typography>
            <DatePicker
                    selected={startTime}
                    onChange={date => setStartTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="Time"
                    minDate={minDate} // Disable previous days
                    // minTime={minTime} // Disable previous times
                    maxTime={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59)} // Set maximum selectable time for today

                />

            </Box>

            <Box >
            <Typography>End time</Typography>
            <DatePicker
                    selected={endTime}
                    onChange={date => setEndTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="Time"
                    minDate={minDate} // Disable previous days
                    // minTime={minTime} // Disable previous times
                    maxTime={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59)} // Set maximum selectable time for today

                />

            </Box>
           
        </Grid>
        <Grid  xs={6} sm={8} md={12} lg={16} item>
            <Button sx={{marginTop:1}}onClick={createAttendance} variant='contained' >Generate</Button>
        </Grid>


        <Grid xs={6} sm={8} md={12} lg={16} item>
            
                
                    {qrcode && <>
                    
                        <Box >
                        <img src={qrcode} alt="QR Code"/> 
                        </Box>
                    <Button sx={{color:'#00563F'}} href={qrcode} download={`${downloadName}.png`}>Download</Button> </>} 
                
            
            
        </Grid>


      </Grid>
      <Snackbar open={openSnack} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
        <Alert
        onClose={closeSnackbar}
        severity={success}
        variant="filled"
        sx={{ width: '100%' }}
        >
        {snackbarLabel}
            </Alert>
        </Snackbar>
       
       
        
        </>
    )





}



export default GenerateAttendance;