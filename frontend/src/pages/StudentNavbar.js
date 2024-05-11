// import {Typography,Button} from '@mui/material'
import {useState,useContext} from 'react';
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
import { useClassContext } from '../hooks/useClassContext';
import { useNavigate, useParams} from "react-router-dom";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#8D1436',  
        }
      }
    }
  }
});

const StudentNavbar=()=>{
    const [open, setOpen] = useState(false);
    const {user,setUser}=useContext(UserContext)
    const{state,dispatch}=useClassContext()
    const {classId}=useParams()
    const navigate=useNavigate()

    const toggleDrawer = (newOpen) => () => {
      
      setOpen(newOpen);
    };

    const whatButton=(index)=>{
        if(index===0){
            return <HomeIcon  />
        }else if(index===1){
            return <LogoutIcon/>
        }
    }

    const whereTo=(index)=>{
      if(index===0){
        navigate('/dashboard')
      }else if(index===1){
        dispatch({type:"SET_CLASSES", payload: null})
        axios.get('/api/logout').then((response)=>{
        })
        navigate("/")
      }
    }
    const drawerList = (
        
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {['Home', 'Sign Out'].map((text, index) => (
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

     const classSettings = ()=>{

      navigate(`/classSettings/${classId}`)
     }
   
    return(

      <ThemeProvider theme={theme}>  
        <AppBar >
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
            
            {!classId?<IconButton onClick={()=>{navigate("/accountSettings")}} color="inherit" ><ManageAccountsIcon/></IconButton>:<IconButton color="inherit" onClick={classSettings}> <SettingsIcon/></IconButton>}
            
          </Toolbar>
        </AppBar>
        </ThemeProvider>
      


    )



}

export default StudentNavbar