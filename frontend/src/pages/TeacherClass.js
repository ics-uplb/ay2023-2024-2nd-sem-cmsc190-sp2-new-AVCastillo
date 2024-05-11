import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Typography,Button,TextField,Select,InputLabel, MenuItem, FormControl,FormLabel,RadioGroup,Radio,Grid,Paper,Box,Tab,Tabs} from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Login from './Login';
import Signup from './Signup';
import {styled} from '@mui/system'
import Navbar from './TeacherNavbar';
import { useClassContext } from '../hooks/useClassContext';
import MyDatePicker from './DatePicker';

import {useParams} from 'react-router-dom';
import GenerateAttendance from './GenerateAttendance';
import TeacherRecord from './TeacherRecords';
import TeacherRecord2 from './TeacherRecords2';
import ExcuseLetters from './ExcuseLetters';
import Notifications from './Notifications';
import { createTheme, ThemeProvider } from '@mui/material';

const paperStyle={width:"390px",height: "589px",margin: "20px auto"}




const theme = createTheme({
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


const TeacherClass =(props)=>{
    const [value,setValue]=useState(0)
    const{state,dispatch}=useClassContext()
    const {classId}=useParams()
    const [view,setView]=useState(true)
    const navigate=useNavigate()
    const [user,setUser]=useState(null)

    
    
    useEffect(()=>{
        // dispatch({type:'GO_TO_CLASS', payload:state.certainId})
        

        async function getUser(){
            const user = await axios.get('/api/getProfile');

            setUser(user.data)
    
            if(user.data===""){
                navigate("/")
            }
        }
        getUser()


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

    const changeView=()=>{
        setView(!view)
    }
    if(user){
        return(

        <>
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Grid sx={{paddingTop:7}} columns={{xs:12, sm:16, md:24, lg:32}} container>
            {/* <Grid item xs={12} sm={16} md={24} lg={32}> */}
            
            <Tabs sx={{position:'sticky'}}value={value}  variant="fullWidth" indicatorColor="primary" textColor="primary" onChange={handleChange}>
            
                    <Tab label="Records"></Tab>
                    <Tab label="QR"></Tab>
                    <Tab label="Excuse"></Tab>
                    <Tab label="Alert"></Tab>
            
            </Tabs>
            </Grid>
            {/* </Grid>  */}
            
            <TabPanel value={value} index={0}>
                <TeacherRecord/>
            
                {/* <Grid sx={{paddingTop:3, paddingBottom:2}} container columns={{xs:12, sm:16, md:24, lg:32}}>
                    <Grid item xs={12} sm={16} md={8} lg={10}>
                    <Button onClick={changeView} sx={{width:"90%"}} variant='contained' fullWidth>Change View</Button>
                </Grid>
                </Grid>
                
                <Box>
                    {view?<TeacherRecord/>:<TeacherRecord2/>}
                    
                </Box> */}


            </TabPanel>
            <TabPanel value={value} index={1}><GenerateAttendance/></TabPanel>
            <TabPanel value={value} index={2}><ExcuseLetters/></TabPanel>
            <TabPanel value={value} index={3}><Notifications/></TabPanel>
        </ThemeProvider>
    </>
        
        )
    }else{

    }
}

export default TeacherClass