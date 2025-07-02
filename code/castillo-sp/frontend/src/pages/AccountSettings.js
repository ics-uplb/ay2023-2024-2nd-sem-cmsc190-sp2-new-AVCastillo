import axios from "axios";
import {useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Dialog,DialogContent,DialogContentText,TextField,DialogTitle,Card,Stack,Divider,Grid,Typography,Button, CircularProgress } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material';



import ContactMailIcon from '@mui/icons-material/ContactMail';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import WcIcon from '@mui/icons-material/Wc';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

import CreateIcon from '@mui/icons-material/Create';


const AccountDetails=['Name','Email','Student Number','Sex', 'Phone #', 'Guardian', 'Guardian #']
const AccountDetailsTeacher=['Name','Email','Sex']
const AccountIcons=[
    <PermIdentityIcon/>, <ContactMailIcon/>, <BadgeIcon/> , <WcIcon/>, <ContactPhoneIcon/>, <EscalatorWarningIcon/>,<ContactEmergencyIcon/>
]

const AccountIconsTeacher=[
    <PermIdentityIcon/>, <ContactMailIcon/> , <WcIcon/>
]
const editLabels=['Edit Phone Number','Edit Guardian Name', 'Edit Guardian Contact']

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
                '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00563F', // Change the outline color here
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00563F', // Change the outline color on hover here
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00563F', // Change the outline color on focus here
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#00563F', // Change the text color here
                    },
                    '&:hover .MuiOutlinedInput-input': {
                      color: '#00563F', // Change the text color on hover here
                    },
                    '&.Mui-focused .MuiOutlinedInput-input': {
                      color: '#00563F', // Change the text color on focus here
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black', // Default label color
                    '&.Mui-focused': {
                      color: '#00563F', // Change label color on focus here
                    },
                  },
            }
        }
    }

      
    
    
  }
});



const AccountSettings=()=>{

    const [studAccount,setStudAccount]=useState(null)
    const [user,setUser]=useState(null)
    const [editPhoneNum,setEditPhoneNum]=useState(null)
    const [editGuardian,setEditGuardian]=useState(null)
    const [editGContact,setEditGContact]=useState(null)
    const [openDialog,setOpenDialog]=useState(false)
    const [dialogTitle, setDialogTitle]=useState(null)
    const [phoneNumHolder,setPhoneNum]=useState(null)
    const [guardianNameHolder,setGuardianName]=useState(null)
    const [guardianContactHolder,setGuardianContact]=useState(null)
    const [indexSelected,setIndexSelected]=useState(null)

    //error fieldprompts
    const [phoneNumError,setPhoneNumError]=useState(false);
    const [gNameError,setGNameError]=useState(false);
    const [gContactError,setGContactError]=useState(false);
 
    
    //error label
    const [phoneNumHelper,setPhoneNumHelper]=useState('');
    const [guardianNameHelper,setGuardianNameHelper]=useState('');
    const [guardianContactHelper,setGuardianContactHelper]=useState('');
    
    const navigate=useNavigate()


    //format
    const phoneNumormat=(target)=>{
        if(target.length===0){
            setPhoneNumError(true)
            setPhoneNumHelper("This field is required!")

        }else if(!(target.length===11)){
            setPhoneNumError(true)
            setPhoneNumHelper("Follow format: 09XXXXXXXX")
        }
        else{
            setPhoneNumError(false)
            setPhoneNumHelper("")
        }
    }

    const gNameFormat=(target)=>{
        if(target.length===0){
            setGNameError(true)
            setGuardianNameHelper("This field is required!")

        }else if(target.length>30){
            setGNameError(true)
            setGuardianNameHelper("Characters must not exceed 30")
        }else{
            setGNameError(false)
            setGuardianNameHelper("")
        }
    }

    const gContactFormat=(target)=>{
        if(target.length===0){
            setGContactError(true)
            setGuardianContactHelper("This field is required!")

        }else if(!(target.length===11)){
            setGContactError(true)
            setGuardianContactHelper("Follow format: 09XXXXXXXX")
        }
        else{
            setGContactError(false)
            setGuardianContactHelper("")
        }
    }


    useEffect(()=>{
        async function getUser(){
            const user= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true})
            if(user.data===""){
                navigate("/")
            }
            setUser(user.data)
            if(user.data.role==='Student'){
                const deets= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getStudentDetails?id=${user.data.id}`,{withCredentials:true})
                setStudAccount(deets.data.details)
            }else{
                const deets= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getTeacherDetails?id=${user.data.id}`,{withCredentials:true})
                setStudAccount(deets.data.details)
            }
            
            
        }
        getUser()

    },[])
    const closeDialog=()=>{
        setOpenDialog(false)
        setPhoneNum(null)
        setGuardianName(null)
        setGuardianContact(null)
        setPhoneNumError(false)
        setGNameError(false)
        setGContactError(false)
        setPhoneNumHelper('')
        setGuardianNameHelper('')
        setGuardianContactHelper('')
        
    }

    const editDetails= async ()=>{
        
            if(indexSelected===0){
                
                if(!phoneNumError){
                    studAccount[indexSelected+4]=phoneNumHolder
                    const data= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/editPhoneNum`,{id:user.id, phoneNum:phoneNumHolder},{withCredentials:true})
                   
                    closeDialog()
                }
            }else if(indexSelected===1){
                    if(!gNameError){
                        studAccount[indexSelected+4]=guardianNameHolder
                        const data= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/editGuardianName`,{id:user.id,guardianName:guardianNameHolder},{withCredentials:true})
                       
                        closeDialog()
                    }
            }else if(indexSelected===2){
                if(!gContactError){
                    studAccount[indexSelected+4]=guardianContactHolder
                    const data= await axios.post(`${process.env.REACT_APP_API_SERVER}/api/editGuardianContact`,{id:user.id,guardianContact:guardianContactHolder},{withCredentials:true})
                    closeDialog()
                }
            }
           
        

    }
    // if(user && user.role==='Student'){
        if(studAccount){
            return(
                <ThemeProvider theme={theme}>
                    <AppBar>
                    <Toolbar>
                        
                        <IconButton onClick={()=>{navigate("/dashboard")}} color="inherit" edge="start" ><ArrowBackIcon/></IconButton>
                        
                        

                    </Toolbar>
                    </AppBar>
                    <Grid  sx={{mt:10}}columns={{xs:8,sm:16,md:24,lg:32}} justifyContent="center" container>
                                
                                <Grid xs={8} sm={16} md={16} lg={24}  item>
                                    <Stack direction="column">
                                    <Typography variant="h5" fontWeight="bold" mt={0} mb={2} sx={{textAlign:"left"}}>Account Settings</Typography>
                                    <Divider />
                                    <Box >
                                    {user && user.role==='Student'?
                                        <List>
                                                { (AccountDetails.map((detail,index)=>(
                                                    <ListItem key={index} disablePadding>
                                                    <Stack direction="row">
                                                        <ListItemButton >
                                                        {/* <AccountCircle sx={{fontSize:30}}/> */}
                                                        <ListItemIcon >{AccountIcons[index]}</ListItemIcon>
                                                        
                                                            <Stack direction="row">
                                                            <ListItemText primary={detail + ":"} sx={{paddingRight:2}}/>
                                                            {index>3?
                                                                <ListItemText><Box sx={{width:'100%'}}><Typography style={{ wordWrap: 'break-word', whiteSpace: 'normal' }} fontWeight={"bold"}>
                                                                {studAccount[index]}</Typography></Box></ListItemText>
                                                        
                                                            :
                                                                <ListItemText><Typography style={{ wordWrap: 'break-word', whiteSpace: 'normal' }} fontWeight={"bold"}>
                                                                {studAccount[index]}</Typography></ListItemText>
                                                            }
                                                        
                                                            
                                                            </Stack>
                                                        
                                                        
                                                        </ListItemButton>
                                                        {index>3?
                                                        // <Box sx={{width:50}}>
                                                        <ListItemSecondaryAction>
                                                        
                                                            <IconButton onClick={()=>{
                                                                setIndexSelected(index-4)
                                                                setOpenDialog(true)
                                                                setDialogTitle(editLabels[index-4])
                                                                
                                                            }}><CreateIcon/></IconButton>
                                                            
                                                        </ListItemSecondaryAction>
                                                        //  </Box>
                                                        :<></>

                                                        }
                                                        
                                                    </Stack>
                                                            
                                                </ListItem>

                                                )))}
                                        </List>
                                        :
                                        <List>
                                        { (AccountDetailsTeacher.map((detail,index)=>(
                                            <ListItem key={index} disablePadding>
                                            <Stack direction="row">
                                                <ListItemButton >
                                                {/* <AccountCircle sx={{fontSize:30}}/> */}
                                                <ListItemIcon >{AccountIconsTeacher[index]}</ListItemIcon>
                                                
                                                    <Stack direction="row">
                                                        <ListItemText primary={detail + ":"} sx={{paddingRight:2}}/>
                                                        <ListItemText><Typography style={{ wordWrap: 'break-word', whiteSpace: 'normal' }} fontWeight={"bold"}>
                                                        {studAccount[index]}</Typography></ListItemText>
                                                
                                                    
                                                    </Stack>
                                                
                                                
                                                </ListItemButton>
                                                
                                            </Stack>
                                                    
                                        </ListItem>

                                        )))}
                                </List>
                                        
                                        
                                        
                                        
                                        
                                        }
                                    
                                    </Box>
                                    </Stack>
                                    <Dialog
                                        open={openDialog}
                                        onClose={closeDialog}
                                    >
                                        <DialogTitle textAlign="center">{dialogTitle}</DialogTitle>
                                        <DialogContent>
                                            <Stack direction={"column"} paddingTop={1} spacing={1}>
                                                
                                                {indexSelected===0?<TextField 
                                                onChange={(e)=>{setPhoneNum(e.target.value);phoneNumormat(e.target.value) }} value={phoneNumHolder}
                                                type="number" size="small" helperText={phoneNumHelper}  error={phoneNumError} label="Enter phone number"></TextField>:<></>}
                                                
                                                {indexSelected===1?<TextField  onChange={(e)=>{setGuardianName(e.target.value);gNameFormat((e.target.value)) }} value={guardianNameHolder}
                                                type="text" size="small" helperText={guardianNameHelper}  error={gNameError} label="Enter guardian name"></TextField>:<></>}
                                                
                                                {indexSelected===2?<TextField  onChange={(e)=>{setGuardianContact(e.target.value);gContactFormat(e.target.value) }} value={guardianContactHolder}
                                                type="number" size="small" helperText={guardianContactHelper}  error={gContactError} label="Enter guardian phone #"></TextField>:<></>}
                                                
                                                
                                                <Button onClick={editDetails} variant="contained">Confirm</Button>
                                            </Stack>

                                        </DialogContent>
                                    </Dialog>
                                </Grid>
                            </Grid>
                </ThemeProvider>
                
            )
        }else{
            <CircularProgress></CircularProgress>
        }
    // }else if(user && user.role==='Teacher'){
    //     return(
    //         <div>hahaha</div>
    //     )
    // }
}

export default AccountSettings