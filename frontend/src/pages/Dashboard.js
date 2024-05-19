import { Fragment, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from 'axios'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./TeacherNavbar";
import StudentNavbar from "./StudentNavbar";
import {Grid,Box,Button,Popper,TextField,Paper,useMediaQuery,IconButton,Card,Divider,Stack,Typography} from '@mui/material'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ViewClass from "./ViewClass";

import { useUserContext } from "../hooks/useUserContext";
import { useClassContext } from "../hooks/useClassContext";
import Cookies from 'js-cookie'

import { createTheme, ThemeProvider } from '@mui/material';

const ButtonTheme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {  // Specifically targets buttons with the 'contained' variant and 'primary' color
              backgroundColor: '#00563F', // Use a specific hex color
              '&:hover': {
                backgroundColor: '#8D1436', // Darker on hover
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


const Dashboard = ()=>{

    const {user,dispatchUser}= useUserContext()
    const {state,dispatch}=useClassContext()
    

    const [userData,setUserData]=useState(null)
    const [userRole,setUserRole]=useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [className,setClassName]=useState('')
    const [section,setSection]=useState('')
    const [classCode,setClassCode]=useState('')
    const [error,setError]=useState('')
    const [openD, setOpenD] = useState(false);
    const [classnameError,setClassnameError]=useState(false);
    const [sectionError,setSectionError]=useState(false);
    const [codeError,setCodeError]=useState(false);
    const [classnameHelper,setClassnameHelper]=useState('');
    const [sectionHelper,setSectionHelper]=useState('');
    const [codeHelper,setCodeHelper]=useState('');
    const [openSnack,setOpenSnack]=useState(false)
    const [success,setSuccess]=useState('')
    const [snackbarLabel,setSnackbarLabel]=useState('')
    const [joinClassD,setJoinClassD]=useState(false)
    const [enterClassCode,setEnterClassCode]=useState('')
    const [refresh,setRefresh]=useState(false)


  
    
    useEffect(()=>{
        setRefresh(false)
        async function getStudClasses(){
            const user= await  axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{
                withCredentials: true
            });
            console.log(user)

            if(user.data===""){
                navigate("/")
            }
            setUserRole(user.data.role)
            setUserData(user.data)
        }
        
        getStudClasses()
        

    },[refresh])
    

 
    const handleClickOpen = () => {
        setOpenD(true);
      };
    
      const handleClose = () => {
        setOpenD(false);
      };
    
    const openJoinD=()=>{
        setJoinClassD(true);
    }
    const closeJoinD=()=>{
        setJoinClassD(false);
    }    
  
    const open = Boolean(anchorEl);
    const popperId = open ? 'simple-popper' : undefined;


    const navigate=useNavigate()

    
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };

    const getUser=()=>{
        axios.get(`/api/findUser?id=${userData.id}`,{withCredentials:true}).then(({data})=>{
        setUserData(data)
       })
    }
    const logout = ()=>{
        axios.get('/api/logout',{withCredentials:true}).then((response)=>{
        })
        navigate('/')
         
        
    }
    const view=()=>{

        navigate('/viewClass')
    }

    const submitJoin= async(e)=>{
        e.preventDefault()

        
        await axios.post(`/api/joinClass`,{code:enterClassCode, studentId:userData.id},{withCredentials:true}).then(res =>{

        })
        closeJoinD()
        setEnterClassCode('')
        setRefresh(true)

    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const teacherId=userData.id
        const teacherName=`${userData.firstName} ${userData.lastName}`
        if(!classnameError && !sectionError && !codeError){
           
            try{
                await axios.post(`/api/createClass`,{className,section,classCode,teacherId,teacherName},{withCredentials:true}).then(res =>{
        
                })
                
                setClassName('')
                setSection('')
                setClassCode('')
                handleClose();
                setSuccess('success')
                setSnackbarLabel('Successfully added class')
                openSnackbar(true)
            
            }catch(e){
                throw e
            }
        }else{
            setSuccess('error')
            setSnackbarLabel('Follow correct format')
            openSnackbar(true)
        }
    }


const classNameFormat=(target)=>{
    if(target.length>8){
        
        setClassnameError(true)
        setClassnameHelper("Maximum of 8 characters only!")
    }else{
        setClassnameError(false)
        setClassnameHelper('')
    }
}
const sectionFormat=(target)=>{
    if(target.length>4){
        setSectionError(true)
        setSectionHelper('Maximum of 4 characters only!')
    }else{
        setSectionError(false)
        setSectionHelper('')
    }
}

const codeFormat=(target)=>{
    if(target.length>8 || target.length<4){
        setCodeError(true)
      
        setCodeHelper('Min 4 & Max 8 characters only!')
    }else{
        setCodeError(false)
        setCodeHelper('')
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


const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    if(userRole==='Student'){
        return(<><ViewClass/></>)       
    }else if(userRole==='Teacher'){
        return(
            <>
            <ThemeProvider theme={ButtonTheme}>
            <Navbar/>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh">
            <Grid container sx={{paddingTop:0}} columns={{xs:6, sm:8, md:12, lg:16}} spacing={2} >
                
                <Grid item xs={6} sm={8} md={12} lg={16}>
                    
                    <Button startIcon={<AddCircleOutlineRoundedIcon/>} variant="contained" onClick={handleClickOpen}>create class</Button>
                    <Dialog
                        open={openD}
                        onClose={handleClose}
                        PaperProps={{
                        component: 'form',
                        onSubmit: handleSubmit,
                        }}
                    >
                        <DialogTitle sx={{textAlign:"center"}}>Create a class</DialogTitle>
                        <DialogContent>
                            
                            <Stack spacing={2} padding={2} direction="column">
                            <TextField  size="small" label="Enter Class Name" onChange={(e)=>{setClassName(e.target.value);classNameFormat(e.target.value)}} helperText={classnameHelper}  error={classnameError}  value={className} required></TextField>
                            <TextField  size="small" label="Enter Class Section"  helperText={sectionHelper}  error={sectionError} onChange={(e)=>{setSection(e.target.value); sectionFormat(e.target.value)}} value={section} required></TextField>
                            <TextField  size="small" label="Enter Class Code"  helperText={codeHelper}  error={codeError} onChange={(e)=>{setClassCode(e.target.value); codeFormat(e.target.value)}} value={classCode}required></TextField>
                            <Button type="submit" sx={{paddingRight:3}}startIcon={<AddRoundedIcon/>} variant="contained" size="small">Create</Button>
                            </Stack>
                            
                        {/* <Grid container padding={2} columns={{xs:6, sm:8, md:8, lg:12}} >
                            <Grid item  sx={{paddingBottom:2,paddingLeft:3}} xs={6} sm={8} md={8} lg={12}>
                                <TextField size="small" label="Enter Class Name" onChange={(e)=>{setClassName(e.target.value);classNameFormat(e.target.value)}} helperText={classnameHelper}  error={classnameError}  value={className} required></TextField>
                            </Grid>
                            <Grid item  sx={{paddingBottom:2,paddingLeft:3}} xs={6} sm={8} md={8} lg={12}>
                                <TextField size="small" label="Enter Class Section"  helperText={sectionHelper}  error={sectionError} onChange={(e)=>{setSection(e.target.value); sectionFormat(e.target.value)}} value={section} required></TextField>
                            </Grid>
                            <Grid item sx={{paddingBottom:2,paddingLeft:3}}>
                            <TextField size="small" label="Enter Class Code"  helperText={codeHelper}  error={codeError} onChange={(e)=>{setClassCode(e.target.value); codeFormat(e.target.value)}} value={classCode}required></TextField>
                                
                            </Grid>
                            <Grid item sx={{paddingBottom:2,paddingLeft:3}} xs={6} sm={8} md={8} lg={12}>
                                <Button type="submit" sx={{paddingRight:3}}startIcon={<AddRoundedIcon/>} variant="contained" size="small">Create</Button>
                                
                            </Grid>
                        </Grid> */}
                        </DialogContent>
                    </Dialog>
                   
                
                </Grid>
                <Grid item xs={6} sm={8} md={12} lg={16}>
                    <Button sx={{width:160}} startIcon={<VisibilityRoundedIcon/>} onClick={view} variant="contained">view class</Button>
                </Grid>
                <Grid item xs={6} sm={8} md={12} lg={16}>
                
                </Grid>   
                <Snackbar open={openSnack} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
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
            </Box>
            </ThemeProvider>
            </> 
        )
    }
    
}

export default Dashboard;