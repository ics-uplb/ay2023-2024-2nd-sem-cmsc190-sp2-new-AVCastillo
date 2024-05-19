import { useEffect, useState } from 'react';
import {Typography,Button,TextField,Select,InputLabel, MenuItem, FormControl,FormLabel,RadioGroup,Radio,Grid,Paper,Box,Tab,Tabs} from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Login from './Login';
import Signup from './Signup';
import {styled} from '@mui/system'
import StudentNavbar from './StudentNavbar';
import { useClassContext } from '../hooks/useClassContext';
import ScanQR from './ScanQR';
import StudentRecord from './StudentRecords';
import Notifications from './Notifications';
import axios from 'axios'
import Cookies from 'js-cookie'



import {useParams} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
       
        indicator:{
            backgroundColor:"#00563F",
            
        }
        // containedPrimary: {  
        //     backgroundColor: "#00563F", // Use a specific hex color
        //     '&:hover': {
        //       backgroundColor: '#7b1113', // Darker on hover
        //     }
        //   },
      }
    },
    MuiTab:{
        styleOverrides:{
            root:{
                color: '#00563F',
                '&.Mui-selected': {  // styles when the tab is selected
                    color: '#00563F', // selected color
                  },
            },
        }
    }
  }
});

const paperStyle={width:"390px",height: "589px",margin: "20px auto"}


const StudentClass =(props)=>{
    const [value,setValue]=useState(0)
    const {classId}=useParams()
    
    const date=new Date()

    const start= new Date(2024,3,12,21,0);
    const end= new Date(2024,3,12,22,0);
    const now= new Date()
    const sample= now.toString()
    const sample2= new Date(sample)
    const navigate=useNavigate()
    const [user,setUser]=useState()
   
    
    
    
    useEffect(()=>{
        async function detectFrauds(){
            const user= await  axios.get('/api/getProfile',{withCredentials:true});
            setUser(user.data)

            if(user.data===""){
                navigate("/")
            }
            const fraud= await  axios.get(`/api/checkFraud?studentId=${user.data.id}`,{withCredentials:true});
           
            if(fraud.data.fraud===true){
                //send notifications
                const dateNow= new Date()
                const dateSubmitted= dateNow.toLocaleDateString('en-US', { weekday: 'short',year: 'numeric', month: 'short', day: 'numeric',hour:'numeric',minute:'numeric' })
                for(const person of fraud.data.peopleInvolved){
                    const name=await axios.get(`/api/getName?studentId=${person}`,{withCredentials:true})
                    await axios.post("/api/createNotification",{classId:classId, senderName:'',senderId:'', sendTo:person,roleOfReceiver:"Student", 
                    type:"Fraud",notifString:"FRAUD: You logged in from a different device",dateSubmitted:dateSubmitted},{withCredentials:true})
                    await axios.post("/api/createNotification",{classId:classId, senderName:'',senderId:'', sendTo:'',roleOfReceiver:"Teacher", type:"Fraud",notifString:`FRAUD: 
                    ${name.data.name} logged in from a different device`,dateSubmitted:dateSubmitted},{withCredentials:true})
                }

                //clear fraud cookies
                Cookies.remove('loggedInUsers')
            }
        }
        detectFrauds()

    },[])

    const handleChange=(event,newValue)=>{
        setValue(newValue);
    }

    const TabPanel=(props)=>{
        const {children,value,index,...other}=props;

        return(
            <div
            role="tabpanel"
            hidden={value !==index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
                {value===index &&(
                    <Box >
                       <Typography>{children}</Typography>     
                    </Box>
                )}

            </div>
        )
    }

    if(user){
        return(
        <div>
        <ThemeProvider theme={theme}>
        
            <StudentNavbar/>
            <Grid sx={{paddingTop:7}} columns={{xs:12, sm:16, md:24, lg:32}} container>
            {/* <Grid item xs={12} sm={16} md={24} lg={32}> */}
            <Tabs value={value}  variant="fullWidth"   onChange={handleChange}>
            
                    <Tab label="Records"></Tab>
                    <Tab label="QR"></Tab>
                    <Tab label="Notifications"></Tab>
                    
            
            </Tabs>
            </Grid>
            {/* </Grid>  */}
            <TabPanel value={value} index={0}><StudentRecord/></TabPanel>
            <TabPanel value={value} index={1}><ScanQR/></TabPanel>
            <TabPanel value={value} index={2}><Notifications/></TabPanel>
           
        </ThemeProvider>
        </div>
        )
    }
}

export default StudentClass