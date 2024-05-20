import {useState,useEffect,useContext} from 'react';
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./TeacherNavbar";
import StudentNavbar from './StudentNavbar';
import {Grid,Box,Button,Popper,TextField,Paper,Card,Divider,Stack,Chip,Dialog} from '@mui/material';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useClassContext } from '../hooks/useClassContext';
import { useUserContext } from '../hooks/useUserContext';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GenerateAttendance from './GenerateAttendance';
import ClassIcon from '@mui/icons-material/Class';
import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


import { createTheme, ThemeProvider } from '@mui/material';

const ButtonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {  // Specifically targets buttons with the 'contained' variant and 'primary' color
            backgroundColor: "#00563F", // Use a specific hex color
            '&:hover': {
              backgroundColor: '#7b1113', // Darker on hover
            }
          },
      }
    },
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



const ViewClass=()=>{
    const {user,dispatchUser}=useUserContext()
    const[role,setRole]=useState(null)
    const [temp,setTemp]=useState('testing')
    const [classState,setClassState]=useState([])
    const {state,dispatch}= useClassContext()
    const [refresh,setRefresh]=useState(false)
    const navigate=useNavigate()
    const [openSnack,setOpenSnack]=useState(false)
    const [success,setSuccess]=useState('')
    const [snackbarLabel,setSnackbarLabel]=useState('')
    const [userRole,setUserRole]=useState('')
    const [joinClassD,setJoinClassD]=useState(false)
    const [enterClassCode,setEnterClassCode]=useState('')
    const[deletePrompt,setDeletePrompt]=useState(false)
    const [index,sentIndex]=useState(null)
    const [teacherJoinClassD,setTeacherJoinD]=useState(false)
    const [enterClassCodeT,setEnterClassCodeT]=useState('')
    
 
    useEffect(()=>{
    
      async function getUserApp(){
        const user = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});

        if(user.data===""){
            navigate("/")
        }

        setUserRole(user.data.role)
        setRole(user.data.role)
        dispatchUser({type:'SET_USER',payload:user})
        if(user.data.role==='Teacher'){
            const classes = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getTeacherClasses?teacherId=${user.data.id}`,{withCredentials:true})
            dispatch({type:'SET_CLASSES',payload:classes})


            setClassState(classes.data)
        }else if(user.data.role==='Student'){
            const classes = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getStudentClasses?studentId=${user.data.id}`,{withCredentials:true})
            dispatch({type:'SET_CLASSES',payload:classes})
            setClassState(classes.data)
        }
      };
    
      getUserApp();
   
      setRefresh(false)
    },[refresh])
    
    
    const closeDeleteDialog=()=>{
        setDeletePrompt(false)
    } 
    
     const deleteClass=()=>{
        
        try{
            axios.delete(`${process.env.REACT_APP_API_SERVER}/api/deleteClass?id=${(state.classes.data)[index]._id}`,{withCredentials:true}).then(({data})=>{
            })
            closeDeleteDialog()
            setRefresh(!refresh)
            setSuccess('success')
            setSnackbarLabel('Successfully deleted class')
            openSnackbar(true)
    
            }catch(e){
                throw e
            }
     }

     const goToClass=(index)=>{
       if(userRole==='Teacher'){
        navigate(`/TeacherClass/${(state.classes.data)[index]._id}`)
       }else if(userRole==='Student'){
        navigate(`/studentClass/${(state.classes.data)[index]._id}`)
       }
        
     }

    const openSnackbar=()=>{
        setOpenSnack(true)
    }
    
    const closeSnackbar=(event,reason)=>{
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false)
    }

    const openJoinD=()=>{
        setJoinClassD(true);
    }
    const closeJoinD=()=>{
        setJoinClassD(false);
    }  
    
    
    const openJoinDT=()=>{
        setTeacherJoinD(true);
    }
    const closeJoinDT=()=>{
        setTeacherJoinD(false);
    }
    const submitJoin= async(e)=>{
        e.preventDefault()

        if(enterClassCode){
            const joinData=await axios.post(`${process.env.REACT_APP_API_SERVER}/api/joinClass`,{code:enterClassCode, studentId:user.data.id},{withCredentials:true})
            if(joinData.data.error){

            
                closeJoinD()
                setEnterClassCode('')
                setRefresh(true)
                setSuccess('error')
                setSnackbarLabel(joinData.data.error)
                openSnackbar(true)
            }else{
                closeJoinD()
                setEnterClassCode('')
                setRefresh(true)
                setSuccess('success')
                setSnackbarLabel(`Joined ${joinData.data.className} class`)
                openSnackbar(true) 
            }
        }

    }

    const submitJoinTeacher= async(e)=>{
        e.preventDefault()
        
        if(enterClassCodeT){
        
            const joinData=await axios.post(`${process.env.REACT_APP_API_SERVER}/api/joinClassTeacher`,{code:enterClassCodeT, teacherId:user.data.id},{withCredentials:true})
            if(joinData.data.error){

            
                closeJoinD()
                setEnterClassCodeT('')
                setRefresh(true)
                setSuccess('error')
                setSnackbarLabel(joinData.data.error)
                openSnackbar(true)
            }else{
                closeJoinD()
                setEnterClassCodeT('')
                setRefresh(true)
                setSuccess('success')
                setSnackbarLabel(`Joined ${joinData.data.className} class`)
                openSnackbar(true) 
            }
        }
    }

    const leaveClass=()=>{

        axios.post(`${process.env.REACT_APP_API_SERVER}/api/leaveClass`,{code:(state.classes.data)[index].classCode, studentId:user.data.id},{withCredentials:true}).then(res =>{

        })
        closeDeleteDialog()
        setRefresh(true)
        setSuccess('success')
        setSnackbarLabel('Successfully left the class')
        openSnackbar(true)
       
    }

    const visitStudentClass=(index)=>{

    }

    const studentClassButtons=(index)=>{
        return(
        <IconButton onClick={()=>{setDeletePrompt(true);sentIndex(index)}}  ><ExitToAppIcon/></IconButton> 
        )

    }
    const TeacherClassButtons=(index)=>{
        // deleteClass(index)
        return(
            <>
            <IconButton onClick={()=>{ setDeletePrompt(true);sentIndex(index)}}  ><DeleteIcon/></IconButton>
            
            </>
        )

    }

   


    if(classState !== null && role!==null){
        return(
            <ThemeProvider theme={ButtonTheme}>
            
            <div>
                
                {role ==="Teacher"? 
                <>
                <Navbar/>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        backgroundColor:'#7b1113',
                        ":hover":{backgroundColor:'#7b1113'},
                        
                        position: 'fixed',
                        bottom: 20,
                        right: { xs: 20, md: '50%' }, // rightmost on xs, centered horizontally on md and up
                        transform: { md: 'translateX(50%)' } // adjust for centering at md and up
                    }}
                    onClick={openJoinDT}
                    >
                    <AddIcon />
                    </Fab>
                </>
                : <><StudentNavbar/>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        backgroundColor:'#7b1113',
                        ":hover":{backgroundColor:'#7b1113'},
                        
                        position: 'fixed',
                        bottom: 20,
                        right: { xs: 20, md: '50%' }, // rightmost on xs, centered horizontally on md and up
                        transform: { md: 'translateX(50%)' } // adjust for centering at md and up
                    }}
                    onClick={openJoinD}
                    >
                    <AddIcon />
                    </Fab>
                    {/* <IconButton sx={{paddingTop:10}} onClick={openJoinD}><AddRoundedIcon/></IconButton> */}
                    </>}
              
                    <Dialog
                    open={joinClassD}
                    onClose={closeJoinD}
                    PaperProps={{
                    component: 'form',
                    onSubmit: submitJoin,
                    }}
                    >
                
                    <DialogTitle sx={{textAlign:"center"}}>Join Class</DialogTitle>
                    <DialogContent>

                            <Stack spacing={2} padding={2} direction="column">
                            <TextField  size="small" label="Enter Class Code" onChange={(e)=>{setEnterClassCode(e.target.value);}} value={enterClassCode} ></TextField>
                        
                        
                            <Button type="submit" variant='contained'>Join</Button>
                            </Stack >
                            
                    </DialogContent>
                    </Dialog>

                    <Dialog
                    open={teacherJoinClassD}
                    onClose={closeJoinDT}
                    PaperProps={{
                    component: 'form',
                    onSubmit: submitJoinTeacher,
                    }}
                    >
                
                    <DialogTitle sx={{textAlign:"center"}}>Join Class</DialogTitle>
                    <DialogContent>

                            <Stack spacing={2} padding={2} direction="column">
                            <TextField  size="small" label="Enter Class Code" onChange={(e)=>{setEnterClassCodeT(e.target.value);}} value={enterClassCodeT} ></TextField>
                        
                        
                            <Button type="submit" variant='contained'>Join</Button>
                            </Stack >
                            
                    </DialogContent>
                    </Dialog>                
                <Grid container sx={{marginTop:10}} columns={{xs:16, sm:16, md:24, lg:32}} spacing={2}>
                    <Grid item xs={16} sm={8} md={6} lg={8}>
                    <Typography fontWeight={"bold"} variant="h5" >Classes</Typography>
                    </Grid>
                    {classState.map((result,index)=>(
                        <Grid item xs={16} sm={8} md={6} lg={8} key={index}>
                            <Card variant="outlined" sx={{ m: 'auto' }}>
                                <Box sx={{ p: 2 }}>
                                    <Stack direction="column">
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight:'bold' }}>
                                                {result.className+ " - " +result.section}
                                            </Typography>
                                            
                                            <ClassIcon fontSize='large'></ClassIcon>
                                        </Stack>
                                        

                                        <Typography textAlign="left" gutterBottom  sx={{ fontWeight:'normal' }} >
                                            {result.TeacherName}
                                        </Typography>
                                        
                                    </Stack>
                                    <Typography sx={{paddingLeft:0}} variant="h6" color="text.secondary">
                                    {/* {result._id} */}
                                    </Typography>

                                </Box>
                            <Divider />
                            <Box sx={{ p: 2 }}>

                                <Stack sx={{paddingLeft:0, alignItems:"center"}}direction="row" >
                                    
                                    <IconButton onClick={()=>{goToClass(index)}} ><VisibilityRoundedIcon/></IconButton>
                                    {role==="Student"? studentClassButtons(index):TeacherClassButtons(index)}
                                    <Dialog
                                        open={deletePrompt}
                                        // onClose={closeDeleteDialog}
                                        
                                    >
                                        <DialogTitle sx={{textAlign:"center"}}>{role==='Teacher'?"Delete Class":"Leave Class"}</DialogTitle>
                                        <DialogContent>
                                            <Button onClick={()=>{role==='Teacher'?deleteClass():leaveClass()}}>Confirm</Button>
                                            <Button onClick={closeDeleteDialog}>Cancel</Button>
                                        </DialogContent>
                                    </Dialog> 
                                   
                                    
                                    
                                </Stack>
                            </Box>
                            </Card>
                            
                        </Grid>    
                    ))}

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
                </Grid>
            </div>
            </ThemeProvider>    
        )
    }else{
        return(
            <div>
                <CircularProgress></CircularProgress>
            </div>
            
        )
    }


}


export default ViewClass;