// import { set } from "mongoose"
import { useEffect,useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
import {toast} from 'react-hot-toast'
import {Typography,Button,TextField,Select,InputLabel,MenuItem,FormLabel,RadioGroup,Radio,Grid,Paper,Box,Tab,Avatar} from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {styled} from '@mui/system'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material';
import image from '../images/arms-logo.jpg'

const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {  // Specifically targets buttons with the 'contained' variant and 'primary' color
                backgroundColor: '#00563F', // Use a specific hex color
                '&:hover': {
                  backgroundColor: "#00563F", // Darker on hover
                }
              },
            colorPrimary: {  // Specifically targets buttons with the 'contained' variant and 'primary' color
            backgroundColor: '#00563F', // Use a specific hex color
            '&:hover': {
                backgroundColor: "#00563F", // Darker on hover
            }
            }
              
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






const CustomTextField= styled(TextField)(({theme})=>({
    marginBottom: '5px',
    
   
    // marginTop: '20px'
}))

const CustomSelect= styled(Select)(({theme})=>({
    marginBottom: '5px',
    // marginTop: '20px'
}))

const CustomPaper= styled(Paper)(({theme})=>({
    padding:"20px",

    // margin: "20px auto",
    width: "330px   ",
    height: "500px",
    // marginBottom: '10px',
    // marginTop: '20px'
}))

const Signup = ()=>{
  
    const [firstName,setFname]=useState('');
    const [lastName,setLname]=useState('');
    const [studentNum,setStudnum]=useState('');
    const [role,setRole]=useState('');
    const [sex,setSex]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const[response, setResponse]=useState('');
    const [error,setError]=useState(null)
    const [redirect,setRed]=useState(false); 
    const [disableStudnum,setDisableStudnum]=useState(false);
    const [openSnack,setOpenSnack]=useState(false);
    const [success,setSuccess]=useState('');
    const [snackbarLabel,setSnackbarLabel]=useState('');

    //error fieldprompts
    const [fNameError,setFnameError]=useState(false);
    const [lNameError,setLnameError]=useState(false);
    const [sexError,setSexError]=useState(false);
    const [roleError,setRoleError]=useState(false);
    const [studentNumError,setStudnumError]=useState(false);
    const [emailError,setEmailError]=useState(false);
    const [passwordError,setPasswordError]=useState(false);
    

    //error label
    const [fNameHelper,setFnameHelper]=useState('');
    const [lNameHelper,setLnameHelper]=useState('');
    const [sexHelper,setSexHelper]=useState('');
    const [roleHelper,setRoleHelper]=useState('');
    const [studentNumHelper,setStudnumHelper]=useState('');
    const [emailHelper,setEmailHelper]=useState('');
    const [passwordHelper,setPasswordHelper]=useState('');

    //format
    const fnameFormat=(target)=>{
        if(target.length===0){
            setFnameError(true)
            setFnameHelper("This field is required!")

        }else{
            setFnameError(false)
            setFnameHelper("")
        }
    }

    const lnameFormat=(target)=>{
        if(target.length===0){
            setLnameError(true)
            setLnameHelper("This field is required!")

        }else{
            setLnameError(false)
            setLnameHelper("")
        }
    }
    const sexFormat=(target)=>{
        if(target.length===0){
            setSexError(true)
            setSexHelper("This field is required!")

        }else{
            setSexError(false)
            setSexHelper("")
        }
    }

    const roleFormat=(target)=>{
        if(target.length===0){
            setRoleError(true)
            setRoleHelper("This field is required!")

        }else{
            setRoleError(false)
            setRoleHelper("")
        }
    }
    const studNumFormat=(target)=>{ 
        if(target.length===0){
            setStudnumError(true)
            setStudnumHelper("This field is required!")

        }else if(!(target.length===9)){
            setStudnumError(true)
            setStudnumHelper("Follow format: 2020XXXXX ")
        }
        else{
            setStudnumError(false)
            setStudnumHelper("")
        }
    }

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

    const passwordFormat=(target)=>{ //customize format
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(target.length===0){
            setPasswordError(true)
            setPasswordHelper("This field is required!")

        }else if(!(passwordRegex.test(target))){
            setPasswordError(true)
            setPasswordHelper("Should consist of atleast 1 uppercase, 1 lowercase, and 1 special character, and 1 digit (Do not use underscore)")
        }else{
            setPasswordError(false)
            setPasswordHelper("")
        }
    }

    // const classes=CustomTextField()
    

    const submit =async(e)=>{
        e.preventDefault()
        let newuser={firstName,lastName,studentNum,role,sex,email,password}
            if(role==="Teacher"){ 
                if((firstName.length > 0 &&lastName.length > 0 &&role.length > 0 &&sex.length > 0 &&email.length > 0 &&password.length)>0){
                    if(!fNameError && !lNameError && !sexError && !roleError && !studentNumError && !emailError && !passwordError){
                        newuser= {firstName,lastName,studentNum:"",role,sex,email,password}
                        try{
                            await axios.post(`${process.env.REACT_APP_API_SERVER}/api/signup`,newuser,{withCredentials:true}).then(res =>{})
                            setFname('')
                            setLname('')
                            setStudnum('')
                            setRole('')
                            setSex('')
                            setEmail('')
                            setPassword('')
                            setDisableStudnum(false)
                            setSnackbarLabel('New User Added')
                            setSuccess("success")
                            setOpenSnack(true)
            
            
                            
                        }catch(e){
                            setSnackbarLabel(e.response.data.error)
                            setSuccess("error")
                            setOpenSnack(true)
                        }
                    }else{
                        setSnackbarLabel("Follow correct field format!")
                        setSuccess("error")
                        setOpenSnack(true)
                    }
                }else{
                    setSnackbarLabel("Fill out all fields!")
                    setSuccess("error")
                    setOpenSnack(true)
                }
            }else if(role==='Student'){
                if((firstName.length > 0 &&lastName.length > 0 &&studentNum.length > 0 &&role.length > 0 &&sex.length > 0 &&email.length > 0 &&password.length>0)){
                    if((!fNameError && !lNameError && !sexError && !roleError && !studentNumError && !emailError && !passwordError)){

                    
                        newuser= {firstName,lastName,studentNum,role,sex,email,password}
                        try{
                            await axios.post(`${process.env.REACT_APP_API_SERVER}/api/signup`,newuser,{withCredentials:true}).then(res =>{})
                            setFname('')
                            setLname('')
                            setStudnum('')
                            setRole('')
                            setSex('')
                            setEmail('')
                            setPassword('')
                            setDisableStudnum(false)
                            setSnackbarLabel('New User Added')
                            setSuccess("success")
                            setOpenSnack(true)
            
            
                            
                        }catch(e){
                            setSnackbarLabel(e.response.data.error)
                            setSuccess("error")
                            setOpenSnack(true)
                        }
                    }else{
                        setSnackbarLabel("Follow correct field format!")
                        setSuccess("error")
                        setOpenSnack(true)
                    }
                }else{
                    setSnackbarLabel("Fill out all fields!")
                    setSuccess("error")
                    setOpenSnack(true)
                }
            }else{
                setSnackbarLabel("Enter a role first!")
                setSuccess("error")
                setOpenSnack(true)

            }   

    
            
        
    }


    const whatRole=(value)=>{
        if(value=="Teacher"){
            setDisableStudnum(true)
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
        return(
           
            <ThemeProvider theme={theme}>
                <Box paddingTop={8}>
           <Box 
              component="img"
              sx={{
                borderRadius:2,
                height: 50,
                width: 50,
                maxHeight: { xs: 300, md: 200 },
                maxWidth: { xs: 300, md: 200 },
              }}
              alt="arms logo"
              src={image}
            />
           </Box>
       
          <Grid   sx={{justifyContent:"center"}} columns={{xs:10, sm:10, md:12, lg:16}} container>
            <Grid xs={9} sm={9} md={11} lg={12} item>
            <Typography variant="h5" textAlign={"center"}  sx={{color:'#00563F'}} paddingTop={0} fontWeight={"bold"}>ARMS: Attendance Recording and Monitoring System</Typography>
            </Grid>
          </Grid>
          
            
            <Box
            sx={{
              my: 2,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: '#7b1113' }}>
              <AppRegistrationIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography> */}
            <Box component="form" noValidate onSubmit={submit} sx={{ mt: 1 }}>

            <Grid container sx={{width:"100%", height:"100%", paddingTop:3}} columns={{xs:6, sm:8, md:12, lg:16}} spacing={2} >
                <Grid item xs={3}sm={4}md={6}lg={8}>
                    <TextField marginBottom={'5px'} size="small" InputProps={{ style:{borderRadius: '0px'}}} type="text"  label="First Name"  
                    onChange={(e)=>{ setFname(e.target.value);fnameFormat(e.target.value)}} helperText={fNameHelper}  error={fNameError} value={firstName} variant="outlined" fullWidth/> 
                </Grid>   
                <Grid item xs={3} sm={4} md={6} lg={8}> 
                    <TextField marginBottom= {'5px'} size="small" InputProps={{ style:{borderRadius: '0px'}}} type="text" label="Last Name"  
                    onChange={(e)=>{ setLname(e.target.value);lnameFormat(e.target.value)}} helperText={lNameHelper}  error={lNameError} value={lastName} variant="outlined" fullWidth />
                </Grid>

                <Grid item xs={3} sm={4} md={6} lg={8}> 
                    <TextField marginBottom= {'5px'} select size="small" InputProps={{ style:{borderRadius: '0px'}}} type="text" label="Sex"  
                        onChange={(e)=>{ setSex(e.target.value); sexFormat(e.target.value)}} helperText={sexHelper}  error={sexError} value={sex} variant="outlined" fullWidth  >
                        <MenuItem value="M"> Male</MenuItem>
                        <MenuItem value="F"> Female</MenuItem>
                        </TextField>

                    
                    </Grid>

                    
                <Grid item xs={3} sm={4} md={6} lg={8}> 
                    <TextField marginBottom= {'5px'} select size="small" InputProps={{ style:{borderRadius: '0px'}}} type="text" label="Role"  
                    onChange={(e)=>{ setRole(e.target.value);roleFormat(e.target.value) 
                        whatRole(e.target.value)}} helperText={roleHelper}  error={roleError}  value={role} variant="outlined" fullWidth  >
                    <MenuItem value="Teacher"> Teacher</MenuItem>
                    <MenuItem value="Student"> Student</MenuItem>

                    </TextField>
                </Grid>

               
                <Grid item xs={6} sm={8} md={12} lg={16}> 
                    {role==="Student"?<TextField marginBottom= {'5px'} type="number" label="Student Number" size="small"  
                    onChange={(e)=>{ setStudnum(e.target.value); studNumFormat(e.target.value)}} helperText={studentNumHelper}  error={studentNumError}  value={studentNum} variant="outlined"  fullWidth />:<></>}
                </Grid>
                <Grid item xs={6} sm={8} md={12} lg={16}>   
                    <TextField marginBottom= {'5px'} type="text" label="Email" size="small" 
                    onChange={(e)=>{ setEmail(e.target.value);emailFormat(e.target.value)}} helperText={emailHelper}  error={emailError} value={email} pattern= '.+@.+' title="wrong email format" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={6} sm={8} md={12} lg={16}> 
                    <TextField marginBottom= {'5px'} type="password" label="Password" size= "small" 
                    onChange={(e)=>{ setPassword(e.target.value);passwordFormat(e.target.value)}} helperText={passwordHelper}  error={passwordError} value={password}  variant="outlined" fullWidth  /> 
                </Grid>

            </Grid>
            
             
              <Button
                type="submit"
               
                variant="contained"
                sx={{ mt: 3, mb: 0}}
                startIcon={<AppRegistrationIcon/>}
              >
                Register
              </Button>

              
            
                
            </Box>
          </Box>
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
          
          </ThemeProvider> 
        )
   
    
}

export default Signup