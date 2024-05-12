import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useUserContext } from "../hooks/useUserContext";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/system'
import LoginIcon from '@mui/icons-material/Login';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material';

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
              color: '#000000', // Default label color
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

const CustomPaper= styled(Paper)(({theme})=>({
    padding:"20px",

    // margin: "20px auto",
    width: "318px   ",
    height: "500px",
    // marginBottom: '10px',
    // marginTop: '20px'
}))

const CustomTextField= styled(TextField)(({theme})=>({
    marginBottom: '5px',
    
   
    // marginTop: '20px'
}))

const Login= ()=>{
    const navigate= useNavigate()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [response,setResponse]=useState('')
    const [error,setError]=useState('')
    const [openSnack,setOpenSnack]=useState(false)
    const [success,setSuccess]=useState('')
    const [snackbarLabel,setSnackbarLabel]=useState('')
    
    const openSnackbar=()=>{
        setOpenSnack(true)
    }
    
    const closeSnackbar=(event,reason)=>{
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false)
    }
    

    
    
    
    const signin= async (e)=>{
        e.preventDefault()


        const creds= {email,password}

        if(email.length===0 && password.length===0){
            setSnackbarLabel("Please enter your credentials")
            setSuccess("error")
            setOpenSnack(true)
        }else{
            try{
                // await axios.post(`${process.env.REACT_APP_API_SERVER}/api/login`,creds).then(res =>{
                //     setResponse(res)
                // })

                fetch(`${process.env.REACT_APP_API_SERVER}/api/login`,{
                  method: 'POST',
                  body: JSON.stringify(creds),
                  credentials:'include',
                  headers:{
                    'Content-Type':'application/json'
                  }
                }).then(res =>{
                  console.log(res)
                })
                
    
                setEmail('')
                setPassword('')
                setSnackbarLabel("Successfully logged in")
                setSuccess("success")
                setOpenSnack(true)
                navigate('/dashboard')
    
            }catch(e){
                setSnackbarLabel(e.response.data.error)
                setSuccess("error")
                setOpenSnack(true)
            }
        }
    }



    return (

        <ThemeProvider theme={theme}>
          <Box
            sx={{
              my: 20,
              mx: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#7b1113' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={signin} sx={{ mt: 1 }}>
            <TextField  margin="normal" type="text" label="Email" size="small" onChange={(e)=>{ setEmail(e.target.value)}} 
            value={email} pattern= '.+@.+' title="wrong email format" variant="outlined" fullWidth  />
             <TextField type="password" label="Password" size= "small" onChange={(e)=>{ setPassword(e.target.value)}} 
             value={password} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" variant="outlined" fullWidth  />  
             
              <Button
                type="submit"
               
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<LoginIcon/>}
              >
                Sign In
              </Button>
              
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
                
            </Box>
          </Box>
          </ThemeProvider>
        
    )
    




}




export default Login