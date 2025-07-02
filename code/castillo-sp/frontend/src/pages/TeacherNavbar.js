// import {Typography,Button} from '@mui/material'
import {useState,useContext,useEffect} from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClassIcon from '@mui/icons-material/Class';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useParams } from "react-router-dom";
import { useClassContext } from '../hooks/useClassContext';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { Grid,Dialog,DialogContent,DialogTitle,TextField,Snackbar,Alert,Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#8D1436',  
        }
      }
    },
    MuiButton: {
      styleOverrides: {
          containedPrimary: {  // Specifically targets buttons with the 'contained' variant and 'primary' color
              backgroundColor: '#00563F', // Use a specific hex color
              '&:hover': {
                backgroundColor: "#00563F", // Darker on hover
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



const Navbar=()=>{
    const [open, setOpen] = useState(false);
    const {state,dispatch}=useClassContext()
    const navigate=useNavigate()
    const {classId}=useParams()
    const [openD,setOpenD]=useState(false)
    const [studentEmail,setStudentEmail]=useState('')
    const [emailError,setEmailError]=useState(false);
    const [emailHelper,setEmailHelper]=useState('');
    const [openSnack,setOpenSnack]=useState(false);
    const [success,setSuccess]=useState('');
    const [snackbarLabel,setSnackbarLabel]=useState('');
    


    const emailFormat=(target)=>{ //customize format
      const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if(target.length===0 ){
          setEmailError(true)
          setEmailHelper("This field is required!")

      }else if( !(emailRegex.test(target))){
          setEmailError(true)
          setEmailHelper("Follow correct email format!")
      }
      else{
          setEmailError(false)
          setEmailHelper("")
      }
  }

    const toggleDrawer = (newOpen) => () => {
      
      setOpen(newOpen);
    };

    const whatButton=(index)=>{
        if(index===0){
            return <HomeIcon  />
        }else if(index===1){
            return <VisibilityIcon/>
        }else{
           return <LogoutIcon/>
        }
    }

    const whereTo=(index)=>{
      if(index===0){
        navigate('/dashboard')
      }else if(index===1){
        navigate("/viewClass")
      }else{
        dispatch({type:"SET_CLASSES", payload:null})
        axios.get(`${process.env.REACT_APP_API_SERVER}/api/logout`,{withCredentials:true}).then((response)=>{
        })
        navigate("/")
      }
    }

    const handleClose=()=>{
      setOpenD(false)
      setStudentEmail('')
      setEmailError('')
      setEmailHelper('')

    }
    const drawerList = (
        
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {['Home', 'View Classes', 'Sign Out'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={()=>{whereTo(index)}}>
                  <ListItemIcon >
                    {whatButton(index)}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
      )


      const drawerListTeacher = (
        
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <List>
          {['Home', 'Create Class', 'View Classes', 'Sign Out'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {whatButton(index)}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
    )  
    const closeSnackbar=(event,reason)=>{
      if (reason === 'clickaway') {
          return;
      }
      setOpenSnack(false)
  }
    const addToClasss= async(e)=>{
      e.preventDefault()
      if(studentEmail){
        const add=await axios.post(`${process.env.REACT_APP_API_SERVER}/api/addToClass`,{classId:classId, email:studentEmail},{withCredentials:true})

        if(add.data.error){
          setSnackbarLabel(add.data.error)
          setSuccess("error")
          setOpenSnack(true)
        }else{
          setSnackbarLabel("User added to class!")
          setSuccess("success")
          setOpenSnack(true)
        }
      }

     

    }
    const classSettings = ()=>{

      navigate(`/classSettings/${classId}`)
     }

    return(
        <>
        <ThemeProvider theme={theme}>  
        <AppBar style={{ height: '60px' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {/* {user.role==="Teacher"?drawerListTeacher:drawerList} */}
                {drawerList}
            </Drawer>
            <>
            {classId?<IconButton sx={{mb:0}}  size="large" edge="start" onClick={()=>{setOpenD(true)}} color="inherit"><AddIcon/></IconButton>:<></>}
            
            {classId?<IconButton sx={{mb:0}}  size="large" edge="start" color="inherit" onClick={classSettings} ><SettingsIcon/></IconButton>:<IconButton  onClick={()=>{navigate("/accountSettings")}} sx={{mb:0}} size="large" edge="start" color="inherit" ><ManageAccountsIcon/></IconButton>}
            {/* <IconButton color="inherit" ><ManageAccountsIcon/></IconButton> */}
            <Dialog
                        open={openD}
                        onClose={handleClose}
                        PaperProps={{
                        component: 'form',
                        onSubmit: addToClasss,
                        }}
                    >
                    <DialogTitle sx={{textAlign:"center"}}>Add a student</DialogTitle>
                      <DialogContent>
                        <Stack spacing={2} padding={2} direction="column">
                        <TextField  size="small" label="Enter student email" onChange={(e)=>{setStudentEmail(e.target.value);emailFormat(e.target.value)}} helperText={emailHelper}  error={emailError}  value={studentEmail} ></TextField>
                        <Button type="submit" sx={{paddingRight:3,}}startIcon={<AddIcon/>} variant="contained" size="small">Add to class</Button>
                        </Stack>
                                
                         
                        </DialogContent>
                    </Dialog>
            
            </>
          </Toolbar>
        </AppBar>
        </ThemeProvider>
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

export default Navbar