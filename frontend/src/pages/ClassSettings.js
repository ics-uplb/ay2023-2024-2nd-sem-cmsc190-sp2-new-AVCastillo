import axios from "axios";
import {useState,useEffect} from 'react'
import { useParams,useNavigate} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Dialog,DialogContent,DialogContentText,TextField,DialogTitle,Card,Stack,Divider,Grid } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import AccountCircle from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import CreateIcon from '@mui/icons-material/Create';


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





const ClassSettings=()=>{
    const {classId}=useParams()
    const navigate=useNavigate()
    const [threshold,setThreshold]=useState(null)
    const [dialog,setDialog]=useState(false)
    const [role,setRole]=useState(null)
    const [people,setPeople]=useState(null)
    const [openD,setOpenD]=useState(false)
    const [name,setName]=useState(null)
    const [sex,setSex]=useState(null)
    const [studentNum,setStudNum]=useState(null)
    const [email,setEmail]=useState(null)
    const [phoneNum,setPhoneNUm]=useState(null)
    const [guardianName,setGuardianName]=useState(null)
    const [guardianContact,setGuardianContact]=useState(null)
    const [user,setUser]=useState(null)


    useEffect(()=>{
        async function getUser(){
            const user= await axios.get("/api/getProfile")
            setUser(user.data)
            if(user.data===""){
                navigate("/")
            }
            setRole(user.data.role)

            const peeps=await axios.get(`/api/displayPeople?classId=${classId}`)
            setPeople(peeps.data.people)
        }
        getUser()
        

    },[])

    const exitSettings=()=>{
        if(role==='Teacher'){
            navigate(`/teacherClass/${classId}`)
        }else{
            navigate(`/studentClass/${classId}`) 
        }
    }

    const closeDialog=()=>{
        setDialog(false)
        setThreshold(null)
    }

    const submitThreshold= async()=>{
        if(threshold){
            const data= await axios.post("/api/absenceThreshold",{classId:classId, threshold:threshold})
        }
       
        
    }

  

    const closeD=()=>{
        setOpenD(false)
        // setName(null)
        // setEmail(null)
        // setSex(null)
        // setStudNum(null)
        // setGuardianContact(null)
        // setGuardianName(null)
    }

    if(user){
        if(role){
            if(role==="Teacher"){
                return(
                    <>
                    <ThemeProvider theme={theme}>
                    <AppBar >
                    <Toolbar>
                    
                        
                        <IconButton color="inherit" edge="start" onClick={exitSettings}><ArrowBackIcon/></IconButton>
                        <IconButton
                        // size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ ml: 'auto' }} 
                        onClick={()=>{setDialog(true)}}
                        ><CreateIcon/></IconButton>
                        
                    </Toolbar>
                    </AppBar>
                    
                    
                    <Dialog
                    open={dialog}
                    onClose={closeDialog}
                    >
                        <DialogTitle textAlign={"center"}>Enter class threshold</DialogTitle>
                        <DialogContent>
                            <Stack direction="column" paddingTop={1} spacing={2}>
                            
                            <TextField  type="number"size="small" label="Enter threshold" onChange={(e)=>{setThreshold(e.target.value);}} value={threshold} required></TextField>
                            <Button variant="contained" onClick={submitThreshold}>Set</Button>
                            </Stack>

                        </DialogContent>
                    </Dialog>
                    <Grid  sx={{mt:10}}columns={{xs:8,sm:16,md:24,lg:32}} justifyContent="center" container>
                        
                        <Grid xs={8} sm={16} md={16} lg={24}  item>
                            <Stack direction="column">
                            <Typography variant="h5" fontWeight="bold" mt={0} mb={2} sx={{textAlign:"left"}}>Teachers</Typography>
                            <Divider />
                            <Box >
                                <List>
                                    {people&& (people.map((person,index)=>(
                                        <ListItem key={index} disablePadding>
                                            {person.role==="Teacher"?
                                            <ListItemButton >
                                            <ListItemIcon ><AccountCircle sx={{fontSize:30}}/></ListItemIcon>
                                                {/* <ListItemIcon>{pdf.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon> */}
                                            <Stack direction="column">
                                            <ListItemText primary={person.firstName} />
                                            {/* <ListItemText primary={"Submitted: "+pdfFileDate[index]} /> */}
                                            
                                            </Stack>
                                            
                                            
                                            </ListItemButton>:<></>
                                        }        
                                    </ListItem>

                                    )))}
                                </List>
                            
                            </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid  columns={{xs:8,sm:16,md:24,lg:32}} justifyContent="center" container>
                        <Grid xs={8} sm={16} md={16} lg={24}  item>
                    <Stack direction="column">
                        <Typography variant="h5" fontWeight="bold" mt={2} mb={2} sx={{textAlign:"left"}}>Students</Typography>
                        <Divider />
                        <Box  >
                            <List>
                                <>
                                {people&& (people.map((person,index)=>(
                                    <>
                                    <ListItem key={index} disablePadding>
                                        {person.role==="Student"?
                                        <Stack direction="row">
                                            <ListItemButton >
                                            <ListItemIcon ><AccountCircle sx={{fontSize:30}}/></ListItemIcon>
                            
                                            <Typography >{`${person.firstName} ${person.lastName}`}</Typography>
                                            </ListItemButton>
                                            <ListItemSecondaryAction>
                                                <IconButton onClick={()=>{
                                                    setName(`${person.firstName} ${person.lastName}`)
                                                    setStudNum(person.studentNum)
                                                    setEmail(person.email)
                                                    setSex(person.sex)
                                                    setPhoneNUm(person.phoneNum)
                                                    setGuardianName(person.guardianName)
                                                    setGuardianContact(person.guardianContact)
                                                    setOpenD(true)

                                                }} edge="end" aria-label="more">
                                                    <InfoIcon/>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                            
                                            
                                        </Stack> :<></>
                                    }
                                </ListItem>
                                <Divider/>
                                </>
                                )))}
                                </>
                            </List>
                        </Box>
                    </Stack>
                    </Grid>
                    </Grid>
                    <Dialog
                    open={openD}
                    onClose={closeD}
                    >
                        <DialogTitle textAlign={"center"}> Student Details</DialogTitle>
                        <DialogContent>
                            <Box m={3}>
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Name: </Typography>
                                        <Typography>{name}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Email: </Typography>
                                        <Typography>{email}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Student number: </Typography>
                                        <Typography>{studentNum}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Sex: </Typography>
                                        <Typography>{sex}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Phone Number: </Typography>
                                        <Typography>{phoneNum}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Guardian Name: </Typography>
                                        <Typography>{guardianName}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row">
                                        <Typography sx={{paddingRight:1,fontWeight:"bold"}}>Guardian Contact: </Typography>
                                        <Typography>{guardianContact}</Typography>
                                    </Stack>
                                    <Divider/>

                                </Stack>
                            </Box>
                        </DialogContent>

                    </Dialog> 
                    </ThemeProvider>
                    </>
                    
                    
                )
            }else{
                return(
                    <>
                    <ThemeProvider theme={theme}>
                    <AppBar >
                    
                    <Toolbar>
                    
                        
                        <IconButton color="inherit" onClick={exitSettings}><ArrowBackIcon/></IconButton>
                        
                    </Toolbar>
                    </AppBar>
                    <Grid  columns={{xs:8,sm:16,md:24,lg:32}} justifyContent="center" container>
                        <Grid xs={8} sm={16} md={16} lg={24}  item>
                            <Stack direction="column">
                            <Typography variant="h5" fontWeight="bold" mt={11} mb={2} sx={{textAlign:"left"}}>Teachers</Typography>
                            <Divider />
                            <Box >
                                <List>
                                    {people&& (people.map((person,index)=>(
                                        <ListItem key={index} disablePadding>
                                            {person.role==="Teacher"?
                                            <ListItemButton >
                                            <ListItemIcon ><AccountCircle sx={{fontSize:30}}/></ListItemIcon>
                                                {/* <ListItemIcon>{pdf.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon> */}
                                            <Stack direction="column">
                                            <ListItemText primary={person.firstName} />
                                            {/* <ListItemText primary={"Submitted: "+pdfFileDate[index]} /> */}
                                            
                                            </Stack>
                                            
                                            </ListItemButton>:<></>
                                        }
                                        
                                    </ListItem>
                                    
                                    
                                    )))}
                                </List>
                            
                            </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid  columns={{xs:8,sm:16,md:24,lg:32}} justifyContent="center" container>
                        <Grid xs={8} sm={16} md={16} lg={24}  item>
                    <Stack direction="column">
                        <Typography variant="h5" fontWeight="bold" mt={2} mb={2} sx={{textAlign:"left"}}>Classmates</Typography>
                        <Divider />
                        <Box  >
                            <List>
                                <>
                                {people&& (people.map((person,index)=>(
                                    <>
                                    <ListItem key={index} disablePadding>
                                        {person.role==="Student"?
                                        
                                        <ListItemButton >
                                        <ListItemIcon ><AccountCircle sx={{fontSize:30}}/></ListItemIcon>
                                            {/* <ListItemIcon>{pdf.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon> */}
                                        <Stack direction="column">
                                        <ListItemText primary={person.firstName} />
                                        {/* <ListItemText primary={"Submitted: "+pdfFileDate[index]} /> */}
                                        
                                        </Stack>
                                        
                                        </ListItemButton> :<></>
                                    }
                                    
                                    
                                    
                                </ListItem>
                                <Divider/>
                                </>
                                
                                
                                
                                )))}
                                
                                </>
                            </List>
                        </Box>
                    </Stack>
                    </Grid>
                    </Grid> 
                    </ThemeProvider>
                    </>
                    
                )
            }
        }
    }
}

export default ClassSettings