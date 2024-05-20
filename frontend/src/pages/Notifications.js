import axios from 'axios'

import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Card, CardContent, Typography, Avatar, CardHeader, IconButton, Stack,Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import WarningIcon from '@mui/icons-material/Warning';
import { createTheme, ThemeProvider } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const notifTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#C3C3C3',  
        }
      }
    },
    
  }
});

const notifications = [
    {
        id: 1,
        title: 'New Friend Request',
        message: 'John Doe sent you a friend request!',
        time: 'Just now',

    },
    {
        id: 2,
        title: 'New Message',
        message: 'Jane Smith sent you a new message!',
        time: '5 minutes ago',

    }
    // Add more notifications as needed
];

const Notifications= ()=>{

    const[role,setRole]=useState(null)
    const[studentNotifs,setStudentNotifs]=useState(null)
    const[teacherNotifs,setTeacherNotifs]=useState(null)
    const {classId}=useParams()
    
    useEffect(()=>{

        async function getUsers(){
            const user= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true})
            setRole(user.data.role)
            if(user.data.role==="Teacher"){
                const notifs= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getNotifications?classId=${classId}`,{withCredentials:true})
                setTeacherNotifs(notifs.data)
                
            }else{
                const notifs= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getStudentNotifs?classId=${classId}&studentId=${user.data.id}`,{withCredentials:true})
                setStudentNotifs(notifs.data)
            }
        }
        getUsers()

    },[])

    if(role==="Student"){
        if(studentNotifs){
            return(
                
                <Box sx={{ width: "100%" }} >
                    <List>
                        {studentNotifs.map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{text.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon>
                            
                            <ListItemText primary={text.notificationString} />
                            </ListItemButton>
                            
                        </ListItem>
                        ))}
                    </List>
                </Box>
                    
                

            )
        }
    }else if(role==="Teacher"){
        if(teacherNotifs){
            return(
            
            <ThemeProvider theme={notifTheme}>

            <Box sx={{ width: "100%" }} >
            <List>
                {teacherNotifs.map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>{text.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon>
                    
                    <ListItemText primary={text.notificationString} />
                    </ListItemButton>
                    
                </ListItem>
                ))}
            </List>
            </Box>
            </ThemeProvider>
            )
        }
        
    }
    




}


export default Notifications;