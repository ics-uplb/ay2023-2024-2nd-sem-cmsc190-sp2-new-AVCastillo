import {useParams} from 'react-router-dom';
import axios from 'axios';
import{useState,useEffect} from 'react'
import { useUserContext } from "../hooks/useUserContext";
import { useNavigate  } from 'react-router-dom';
import {Box,Button,Grid,IconButton,Dialog,Stack, Icon, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';


import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import InputAdornment from '@mui/material/InputAdornment';
// const options = ['Option 1', 'Option 2', 'Option 3'];

import TeacherRecord2 from './TeacherRecords2';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { createTheme, ThemeProvider } from '@mui/material';

const ButtonTheme = createTheme({
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



const TeacherRecord=()=>{
    const {classId}=useParams()
    const navigate=useNavigate()
    // const {user,dispatchUser}= useUserContext()
    const[userId,setUserId]=useState(null)
    const[records,setRecords]=useState(null)
    const [rows,setRows]=useState(null)
    const [details,setDetails]=useState(false)
    const [dateRecorded,setDateRecorded]=useState('')
    const [location,setLocation]=useState(null)
    const [status,setStatus]=useState('')
    const [options,setOptions]=useState(null)
    const [searchHolder,setSearchHolder]=useState(null)
    const [refresh,setRefresh]=useState(true)
    const [confirmEdit,setConfirmEdit]=useState(false)
    const [confirmVar,setConfirmVar]=useState(false)
    const [newStatus, setNewStatus]=useState('')
    const [parameters,setParameters]=useState(null)
    const [userName, setUserName]=useState(null)
    const [view,setView]=useState(true)
    const [classLabel,setClassLabel]=useState(null)
    
    

    useEffect(()=>{
        async function getUser(){
            const user=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});
            setUserId(user.data.id)
            setUserName(user.data.firstName + " " + user.data.lastName)
            const absent=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/autoAbsentClass?classId=${classId}`,{withCredentials:true})
            const dates=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getTeacherAttendance?classId=${classId}`,{withCredentials:true})
            setOptions(dates.data.dates)
            const label=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/classLabel?classId=${classId}`,{withCredentials:true});
            console.log(label.data)
            setClassLabel(label.data)
            
        }
        getUser()
    },[])

    const createHandleMenuClick = async (menuItem,params) => {
     
        if (params.row.status!==menuItem){
            setConfirmEdit(true)
            setNewStatus(menuItem)
            setParameters(params)
          }
      
    };

    const confirmChangeStatus= async()=>{
      
        (parameters.row)["status"]=newStatus
        const edited= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/editStatus`,{indivId:parameters.row.studentId, attendanceCollectionId:parameters.row.attendanceCollectionId, updatedStatus:newStatus},{withCredentials:true})
        const dateNow= new Date()
        const dateSubmitted= dateNow.toLocaleDateString('en-US', { weekday: 'short',year: 'numeric', month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' })
        await axios.post(`${process.env.REACT_APP_API_SERVER}/api/createNotification`,{classId:classId, senderName:userName, senderId:userId ,sendTo:parameters.row.studentId,roleOfReceiver:"Student",
         type:"Attendance",notifString:`${userName} changed your attendance for ${parameters.row.convertedDate} to ${newStatus}`,dateSubmitted:dateSubmitted},{withCredentials:true})
    
    }
    const closeDetails=()=>{
      setDetails(false)
    }

    const closeConfirm=()=>{
      setConfirmEdit(false)
    }
    const columns = [        
        {
            field: 'convertedDate',
            headerName: 'Date',
            width: 150,
            editable: true,
            filterable:false,
            sortable:false
          },
          {
            field: 'name',
            headerName: 'Name',
            width: 110,
            editable: true,
            filterable:false,
            sortable:false,
            pinning:{position:"left"}
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 115,
            editable: true,
            filterable:false,
            sortable:false,
            renderCell:(params)=>{
              return(
                <>
                {params.row.submittedExcuse && params.row.status==='Absent'?<Stack direction="row" mt={0}><Typography mt={1.5} sx={{color:'#7b1113',fontWeight: 'bold'}}>{params.row.status}
                </Typography><IconButton sx={{marginTop:0.5}} onClick={()=>{handleOpenPDF(params.row._id)}}><MarkEmailUnreadIcon/></IconButton></Stack>:
                <div>{params.row.status==='Present'|| params.row.status==='Late'? <Typography sx={{color:'#00563F',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>} 
                {params.row.status==='Absent' ?<Typography sx={{color:'#7b1113',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>}
                {params.row.status==='Excused'?<Typography sx={{color:'#FFB61C',marginTop:1.5,fontWeight: 'bold'}}>{params.row.status}</Typography>:<></>}</div>}
                </>
              )
            }
          },
          
          {
            field: 'actions',
            headerName: '',
            width: 110,
            disableColumnMenu:true,
            filterable:false,
            sortable:false,
            renderCell: (params) => {
            return (
              <>
              
              {/* <IconButton><EditIcon/></IconButton> */}
              <Dialog
                open={confirmEdit}
                onClose={closeConfirm}
              >
                <DialogTitle sx={{textAlign:"center"}}>Confirm Edit</DialogTitle>
                <DialogContent>
                  <>
                  <Button sx={{color:"#00563F"}} onClick={()=>{confirmChangeStatus();setConfirmEdit(false)}}>Yes</Button>
                  <Button sx={{color:"#00563F"}} onClick={()=>{setConfirmEdit(false)}}>No</Button>
                  </>
                  

                </DialogContent>
                </Dialog>
              <Box>
              
              <Dropdown>
              <Stack direction="row">
              <IconButton onClick={()=>{setDateRecorded(params.row.date);setStatus(params.row.status);setLocation(params.row.location);setDetails(true) }}><InfoIcon/></IconButton>
              <MenuButton><EditIcon sx={{color:"black"}}/></MenuButton>
              
              </Stack>
              <Menu slots={{ listbox: Listbox }}>
                <MenuItem onClick={()=>{createHandleMenuClick('Present',params)}}>Present</MenuItem>
                <MenuItem onClick={()=>{createHandleMenuClick('Absent',params)}}>
                  Absent
                </MenuItem>
                <MenuItem onClick={()=>{createHandleMenuClick('Late',params)}}>Late</MenuItem>
                <MenuItem onClick={()=>{createHandleMenuClick('Excused',params)}}>Excused</MenuItem>
              </Menu>
            </Dropdown>
            </Box>
              </>
            );
              
            },
          },
      
      ];


      const search= async()=>{

        const attendance= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/searchDisplay`,{classId:classId,searchDate:searchHolder},{withCredentials:true})
        const gridRecord=attendance.data


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
      }


      const handleOpenPDF = async (indivAttendanceId) => {

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getExcuseLetters?indivAttendanceId=${indivAttendanceId}`, {
              responseType: 'blob'  // This is crucial to handle the PDF file correctly
          },{withCredentials:true});
          const pdfBlob = response.data;
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
      
  
          if (!pdfUrl) {
              console.error('No PDF buffer data provided');
              return;
          }
          window.open(pdfUrl, '_blank');
          // const url = URL.createObjectURL(pdfUrl);
          // const link = document.createElement('a');
          // link.href = pdfUrl;
          // link.download = 'test.pdf';
          // link.click();
  
          // Optional: cleanup the blob URL after it's no longer needed
          URL.revokeObjectURL(pdfUrl);
        } catch (error) {
          console.error('Error fetching PDF', error);
      }
    };

    const changeView=()=>{
      setView(!view)
  }


     
    // if(records!==null){
       if(options!==null){
        if(view){
          return(
              <>
                <Box paddingTop={2}>
                <Typography  marginLeft={2.1} variant='h6' fontWeight={"bold"} textAlign={"left"} paddingBottom={1}>{classLabel}</Typography>
                </Box>
              
                <Grid sx={{paddingTop:1}} container columns={{xs:12, sm:16, md:24, lg:32}}>
                
                  <Grid item xs={12} sm={16} md={8} lg={6} order={{ md: 2, lg: 2 }}>

                  <Button  onClick={changeView} sx={{width:"90%",marginBottom:2}} variant='contained' fullWidth>Change View</Button>
                  </Grid>
                  <Grid item xs={12} sm={16} md={8} lg={6} order={{ xs: 2, sm: 2, md: 1, lg: 1 }}>
                  <Autocomplete
                  
                  options={options}
                  onChange={(e,value)=>{setSearchHolder(value)}}
                  renderInput={(params) => (
                      <TextField 
                      fullWidth
                      
                      {...params}
                      label="Search"
                      variant="outlined"
                      sx={{width:"90%",color:"#00563F"}}
                      size='small'
                      

                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            
                            <IconButton onClick={search}><SearchIcon/></IconButton>
                          </InputAdornment>
                        ),
                      }}
                      
                      />
                  )}
                  />
                  </Grid>

              </Grid>  
                  
                  
                
            
              <Box display="flex" justifyContent="center" sx={{margin:2, height: 400, width: "90%"}}>
                  
                <Dialog
                  open={details}
                  onClose={closeDetails}
                >
                  <DialogTitle sx={{textAlign:"center"}}>Details</DialogTitle>
                  <DialogContent>

                  <Stack direction="column">
                    <Stack direction="row" >
                      <Typography fontWeight={"bold"} paddingRight={3.2}>Status: </Typography>
                      <Typography>{status}</Typography>
                    </Stack>

                    <Stack direction="row" >
                      <Typography fontWeight={"bold"} paddingRight={5}>Date:</Typography>
                      <Typography>{dateRecorded}</Typography>
                    </Stack>
                    
                    <Stack direction="row" >
                    <Typography fontWeight={"bold"} paddingRight={1}>Location:</Typography>
                    <Typography>{location}</Typography>
                    </Stack>
                  </Stack>

                  </DialogContent>
                  </Dialog>
              {rows?<DataGrid
              rows={rows}
              columns={columns}
              
              initialState={{
              pagination: {
                  paginationModel: {
                  pageSize: 5 ,
                  },
              },
              }}
              pageSizeOptions={[5]}
              
              
              disableRowSelectionOnClick
              />:
              
              <DataGrid
              
              columns={columns}
              initialState={{
              pagination: {
                  paginationModel: {
                  pageSize: 5 ,
                  },
              },
              }}
              pageSizeOptions={[5]}
              
              disableRowSelectionOnClick
              />
              
              }
            </Box>
            </>
            )
          }else{
            return(
              <TeacherRecord2/>
            )
          }
    // }else{
    //     return(
    //         <CircularProgress></CircularProgress>
    //     )
    // }
    }else{
      return(
        <CircularProgress></CircularProgress>
      )
    }

}
const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
};

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

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
  };
  z-index: 1;
  `,
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }
  `,
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  background: none;
  border: none;
  box-shadow: none;

  &:hover, &:focus {
    background-color: transparent; // Ensures that no color appears on hover or focus
    border: none;
    outline: none; // Removes the focus outline if needed
  }
  
  `
);

export default TeacherRecord;