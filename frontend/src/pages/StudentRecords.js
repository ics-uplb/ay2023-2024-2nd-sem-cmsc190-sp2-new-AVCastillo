import {useParams} from 'react-router-dom';
import axios from 'axios';
import{useState,useEffect} from 'react'
import { useUserContext } from "../hooks/useUserContext";
import {Box,Button,Grid,IconButton,Dialog,Stack,Typography,TextField,Card, Alert, Snackbar} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Tooltip from '@mui/material/Tooltip';
import styled from '@emotion/styled';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WarningIcon from '@mui/icons-material/Warning';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';

import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    
    MuiTextField:{
      styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00563F', // Change the outline color here
            },
            '& .MuiOutlinedInput-input': {
              color: '#00563F', // Change the text color here
            },
            '& .MuiInputLabel-root': {
              color: 'black', // Default label color
            },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00563F', // Change the outline color on hover here
            },
            '&:hover .MuiOutlinedInput-input': {
              color: '#00563F', // Change the text color on hover here
            },
            '& .Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00563F', // Change the outline color on focus here
            },
            '& .Mui-focused .MuiOutlinedInput-input': {
              color: '#00563F', // Change the text color on focus here
            },
            '& .Mui-focused .MuiInputLabel-root': {
              color: '#00563F', // Change label color on focus here
            },
          }
      }
  }
  }
});


const CustomFilePresentIcon = styled(FilePresentIcon)({
  color: 'green', // You can use any color value
});


const StudentRecord=()=>{
    const {classId}=useParams()
    const[userId,setUserId]=useState(null)
    const[records,setRecords]=useState(null)
    const [rows,setRows]=useState(null)
    const [details,setDetails]=useState(false)
    const [excuse,setExcuse]=useState(false)
    const [dateRecorded,setDateRecorded]=useState('')
    const [location,setLocation]=useState('')
    const [status,setStatus]=useState('')
    const [file, setFile] = useState(null);
    const [numAbsences,setNumAbsences]=useState(0)
    const [numExcuses,setNumExcuses]=useState(0)
    const [numPending,setNumPending]=useState(0)
    const [handleUpName,setHandleUpName]=useState(null)
    const [handleUpDate,setHandleUpDate]=useState(null)
    const [handleUpIndivId,setHandleUpIndivId]=useState(null)
    const [paramsIndex,setParamsIndex]=useState(null)
    const [absenceWarning,setWarning]=useState(false)
    const [absenceReached,setReached]=useState(false)
    const [absenceExceeded,setExceeded]=useState(false)
    const [classLabel,setClassLabel]=useState(null)
    const [anchor, setAnchor] =useState(null);
    const [openSnack, setOpenSnack]=useState(false)
    const [snackbarLabel, setSnackbarLabel]=useState(null)
    const [success,setSuccess]=useState(null)
    const open = Boolean(anchor);
    const id = open ? 'simple-popup' : undefined;
    
    
    

    useEffect(()=>{
        async function getUser(){
            const user=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});
            setUserId(user.data.id)
            const label=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/classLabel?classId=${classId}`,{withCredentials:true});
            console.log(label.data)
            setClassLabel(label.data)

            const absent=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/autoAbsent?classId=${classId}&studentId=${user.data.id}`,{withCredentials:true})
            const record= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/displayStudentAttendance?classId=${classId}&studentId=${user.data.id}`,{withCredentials:true})
            const gridRecord=record.data
            setRecords(record)
            // dispatchUser({type:'SET_USER',payload:user})
            


            const convertDate=()=>{
              gridRecord.forEach((element)=>{
                const fullString= new Date(element.searchDate)
                const converted=fullString.toLocaleDateString('en-US', { weekday: 'short',year: 'numeric', month: 'short', day: 'numeric' })
                element["convertedDate"]=converted
              })
            }
            convertDate()
      
            gridRecord.forEach((element,index) => {
              element["id"]=index
            });
            setRows(gridRecord)

            const threshold= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getClassThreshold?classId=${classId}`,{withCredentials:true})
            

            const absences= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getAbsences?classId=${classId}&studentId=${user.data.id}`,{withCredentials:true})
            let absence=0
            let excuses=0
            let pending=0
            for(const data of absences.data){
              if(data.status==="Absent"){
                absence+=1
              }else if(data.status==="Not Yet Scanned"){
                pending+=1
              }
              else{
                excuses+=1
              }
            }

            if((absence+excuses)===(threshold.data.threshold)-1){
              
              setWarning(true)
             
            }
            if((absence+excuses)===(threshold.data.threshold)){
              setReached(true)
              
             
            }

           if((absence+excuses)>(threshold.data.threshold)){
              setExceeded(true)
            }
            setNumAbsences(absence)
            setNumExcuses(excuses)
            setNumPending(pending)
            
        }
        
        getUser()
    },[])

    const closeSnackbar=()=>{
      setOpenSnack(false)
    }
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleUpload = async () => {
      if(file){
        try {

          const dateNow= new Date()
          const dateSubmitted= dateNow.toLocaleDateString('en-US', { weekday: 'short',year: 'numeric', month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' })
          const formData = new FormData();
          formData.append('pdf', file);
          formData.append('classId', classId);
          formData.append('studentId',userId)
          formData.append('dateSubmitted',dateSubmitted)
          formData.append('indivAttendanceId',handleUpIndivId)
          await axios.post(`${process.env.REACT_APP_API_SERVER}/api/uploadExcuseLetter`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
         
          
          await axios.post(`${process.env.REACT_APP_API_SERVER}/api/createNotification`,{classId:classId, senderName:handleUpName,senderId:userId, sendTo:'',roleOfReceiver:"Teacher", type:"Excuse"
          ,notifString:`${handleUpName} sent an excuse letter for ${handleUpDate} class`,dateSubmitted:dateSubmitted},{withCredentials:true})
          await axios.post(`${process.env.REACT_APP_API_SERVER}/api/editSubmittedExcuse`,{indivAttendanceId:handleUpIndivId, submitted:true},{withCredentials:true})

          for(const rec of rows){
            if (rec.id===paramsIndex){
              rec["submittedExcuse"]=true;
            }
          }
          setOpenSnack(true)
          setSnackbarLabel('PDF file uploaded successfully')
          setSuccess('success')
        } catch (error) {
          console.error(error);
          setOpenSnack(true)
          setSnackbarLabel('Error uploading PDF file')
          setSuccess('error')
        }
        setFile(null)
        closeExcuse()
      }else{
        
        setOpenSnack(true)
        setSnackbarLabel("Choose a file first")
        setSuccess('warning')
        
      }
    };

    const closeExcuse=()=>{
      setExcuse(false)
    }
    const closeDetails=()=>{
      setDetails(false)
    }
    const columns = [        
        {
            field: 'convertedDate',
            headerName: 'Date',
            width: 150,
            editable: false,
            filterable:false,
            sortable:false
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 110,
            // editable: true,
            renderCell:(params)=>{
              return(
              <div>{params.row.status==='Present'|| params.row.status==='Late'? <Typography sx={{color:'#00563F',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>} 
                {params.row.status==='Absent' ?<Typography sx={{color:'#7b1113',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>}
                {params.row.status==='Excused'?<Typography sx={{color:'#FFB61C',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>}</div>)
                }
            
          },
          {
            field: 'actions',
            headerName: '',
            width: 110,
            disableColumnMenu:true,
            renderCell: (params) => {

              if(params.row.status==='Present'|| params.row.status==='Late'){
                return (
                  <Box mt={-0.5}>
                 <IconButton onClick={()=>{setDateRecorded(params.row.date);setStatus(params.row.status); setLocation(params.row.location); setDetails(true) }}><InfoIcon/></IconButton>
                 </Box>
                );
              }else if(params.row.status==='Absent'){
                return(
                  <>
                  <Box mt={-0.5}>
                  <IconButton onClick={()=>{setDateRecorded(params.row.date);setStatus(params.row.status);setLocation(params.row.location);setDetails(true) }}><InfoIcon/></IconButton>
                  {!params.row.submittedExcuse?<IconButton onClick={()=>{setExcuse(true);setHandleUpName(params.row.name);setHandleUpDate(params.row.convertedDate);setHandleUpIndivId(params.row._id);setParamsIndex(params.row.id)}}><AttachFileIcon/></IconButton>:<IconButton disabled><Tooltip title="Excuse letter already submitted"><CustomFilePresentIcon/></Tooltip></IconButton>}
                  
                  <Dialog
                 open={excuse}
                 onClose={closeExcuse}>
                  <DialogTitle sx={{textAlign:"center"}}>Submit Excuse Lettter</DialogTitle>
                    <DialogContent >
                      <Stack spacing={2} direction="column">
                    <TextField  type="file" onChange={handleFileChange} />
                    
                    <Button variant="contained" sx={{backgroundColor:"#00563F",'&:hover': {backgroundColor: '#8D1436',}}} onClick={()=>{handleUpload()}}>Upload PDF</Button>
                    </Stack>
                    </DialogContent>
                  </Dialog>
                  
                  </Box>
                  </>
                )
              }
            },
          },
      
      ];

      const handleClick = (event) => {
        setAnchor(anchor ? null : event.currentTarget);
      };

    const exportAsExcel= ()=>{
      const headers = columns.map(col => col.headerName); // Extract headers from columns
      headers.pop()
      let temp=columns
      temp.pop()


      const data = rows.map(row => {
        return temp.map(col => row[col.field]); // Create row data based on column order
        });
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        
        // Write the workbook and initiate download
        XLSX.writeFile(workbook,`Attendance Record.xlsx`);
    
      }


     
    if(records!==null){
        return(
          <div>
            <Box sx={{ height: "60vh", width: '100%' }}>
              <Dialog
                open={details}
                onClose={closeDetails}
            >
                <DialogTitle sx={{textAlign:"center"}}>Details</DialogTitle>
                <DialogContent>
                 
                  {/* <><DialogContentText>{status}</DialogContentText>
                  <DialogContentText>{dateRecorded}</DialogContentText>
                  <DialogContentText>{location}</DialogContentText>
                  </> */}
                  <Stack direction="column">
                    <Stack direction="row" >
                      <>
                      <Typography fontWeight={"bold"} paddingRight={3.2}>Status: </Typography>
                      <Typography>{status}</Typography>
                      </>
                    </Stack>

                    <Stack direction="row" >
                      <>
                      <Typography fontWeight={"bold"} paddingRight={5}>Date:</Typography>
                      <Typography>{dateRecorded}</Typography>
                      </>
                    </Stack>
                    
                    <Stack direction="row" >
                    <>
                    <Typography fontWeight={"bold"} paddingRight={1}>Location:</Typography>
                    <Typography>{location}</Typography>
                    </>
                    </Stack>
                  </Stack>
                  
                  

                </DialogContent>
                </Dialog>

            <Box sx={{paddingTop:2}}>
              <Typography  marginLeft={1.7} variant='h6' fontWeight={"bold"} textAlign={"left"} paddingBottom={1}>{classLabel}</Typography>
              <Stack direction="row">
                
                <Box margin={1}>
                  <Card >
                    
                        <Stack direction="row" spacing={0.5}>
                          <>
                          <Typography sx={{fontSize:12,fontWeight:'bold',paddingTop:1.5,paddingLeft:1,paddingBottom:1.2}}>Absences:</Typography>
                          <Typography sx={{fontSize:12,paddingTop:1.5,paddingRight:1}}>{numAbsences}</Typography>
                          </>
                          {absenceWarning?
                          
                          <IconButton onClick={handleClick}><WarningIcon sx={{color:"#ffb61c"}}/></IconButton>
                          
                          
                          :<></>}
                          {absenceReached?<IconButton onClick={handleClick}><WarningIcon sx={{color:"#ffb61c"}}/></IconButton>:<></>}
                          {absenceExceeded?<IconButton onClick={handleClick}><WarningIcon sx={{color:"#8d1436"}}/></IconButton>:<></>}
                        </Stack>
                        <BasePopup id={id} open={open} anchor={anchor}>
                          <PopupBody>
                           
                            {absenceWarning?<Stack direction="row"><><Typography sx={{fontSize:12,paddingRight:1,paddingTop:1.3}}>You are about to reach maximum number of absences</Typography></><IconButton  onClick={()=>{setAnchor(null)}}><CloseIcon/></IconButton></Stack>:<></>}
                            {absenceReached?<Stack direction="row"><><Typography sx={{fontSize:12,paddingRight:1,paddingTop:1.3}}>You reached the maximum number of absences</Typography></><IconButton  onClick={()=>{setAnchor(null)}}><CloseIcon/></IconButton></Stack>:<></>}
                            {absenceExceeded?<Stack direction="row"><><Typography sx={{fontSize:12,paddingRight:1,paddingTop:1.3}}>You exceeded the maximum number of absences</Typography></><IconButton  onClick={()=>{setAnchor(null)}}><CloseIcon/></IconButton></Stack>:<></>}
                          
                          </PopupBody>
                        
                        </BasePopup>
                    
                    
                  </Card>
                  </Box>
                  <Box margin={1}>
                    <Card>
                    
                      <Stack direction="row" spacing={0.5}>
                        <>
                        <Typography sx={{fontSize:12,fontWeight:'bold',paddingTop:1.5,paddingLeft:1,paddingBottom:1.2}}>Excused:</Typography>
                        <Typography sx={{fontSize:12,paddingTop:1.5,paddingRight:1}}>{numExcuses}</Typography>
                        </>
                      </Stack>
                    
                    </Card>
                    </Box> 
                    <Box margin={1}> 
                      <Card>
                        
                          <Stack direction="row" spacing={0.5}>
                            <>
                            <Typography sx={{fontSize:12,fontWeight:'bold',paddingTop:1.5,paddingLeft:1,paddingBottom:1.2}}>Pending:</Typography>
                            <Typography sx={{fontSize:12,paddingTop:1.5,paddingRight:1}}>{numPending}</Typography>
                            </>
                          </Stack>
                        
                      </Card>
                  </Box>
              </Stack>  
              </Box>  
            
            <DataGrid
              
              sx={{marginTop:5}}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[5]}
             
              disableRowSelectionOnClick
            />

            <Button sx={{color:'#00563F'}} onClick={exportAsExcel}>Download</Button>
               
          </Box>
          
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
        </div>
        )
    }else{
        return(
            <CircularProgress></CircularProgress>
        )
    }

}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`,
);




export default StudentRecord;