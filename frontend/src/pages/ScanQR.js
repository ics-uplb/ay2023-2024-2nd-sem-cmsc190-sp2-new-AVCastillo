import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {Box,Button, Typography,Snackbar,Alert,Stack} from '@mui/material'
import { useUserContext } from '../hooks/useUserContext';
import CircularProgress from '@mui/material/CircularProgress';
import {useParams} from 'react-router-dom';


const ScanQR=()=>{
    const[indivAttendanceId,setIndivAttendanceId]=useState('')
    const [scannedResult, setScannedResult]=useState(null)
    const {user,dispatchUser}=useUserContext()
    const [holder,setHolder]=useState(null)
    const [isScanning, setIsScanning] = useState(true);
    const {classId}=useParams()
    const [address,setAddress]=useState(null)
    const [openSnack, setOpenSnack]=useState(null)
    const [success, setSuccess]=useState(null)
    const [snackbarLabel, setOpenSnackbarLabel]=useState(null)
    const [circularTimer,setTimer]=useState(false)
    let qrScanner = null;

    // const [address,setAddress]=useState(null)

    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
    });


    const reverseGeocodeOSM = async (lat, lng) => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
          const response = await axios.get(url);
        //   console.log(response.data.display_name)
        //   setAddress(response.data.display_name)
        
        //   setAddress(response.data.display_name)
          return response.data.display_name; // Returns the full address
        } catch (error) {
          console.error('Geocoding error:', error.message);
        //   return null;
        }
      };  


    const onSuccess = location => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
        });

        async function reverse(){
            const address= await reverseGeocodeOSM(location.coords.latitude,location.coords.longitude)
            console.log(address)
            setAddress(address)
        }
        reverse()
        // console.log(location.coords.latitude)
        // console.log(reverseGeocodeOSM(location.coords.latitude,location.coords.longitude))
        // setAddress(reverseGeocodeOSM(location.coords.latitude,location.coords.longitude))
        // console.log(address)
        

    };

    const onError = error => {
        setLocation({
            loaded: true,
            error,
        });
        console.log(error)
    };
    const closeSnackbar=()=>{
        setOpenSnack(false)
      }
    

    useEffect(()=>{

        async function getUser(){
            const student = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});
            dispatchUser({type:'SET_USER',payload:student})

        }

        getUser()

         //get location
        const geoOptions = {
            maximumAge: 30000,
            timeout: 10000,
            enableHighAccuracy: true  // Request higher accuracy from the device
        };
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation not supported",
            });
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError,geoOptions);


    },[])


   const startTimeout=()=>{
    
    async function timeout(){
        setTimer(true)
        await delay(2500)
        setTimer(false)
        startScanning()
    }
    
    timeout()
    
  
  
   }


    const startScanning = () => {
        console.log(address)

        if(isScanning){
                setIsScanning(false);
                qrScanner = new Html5QrcodeScanner(
                'scanner', // elementId
                {
                    fps: 10,    // Optional, frame per seconds for qr code scanning
                    qrbox: 250  // Optional, if you want bounded box UI
                },
                /* verbose= */ false);


                const success=(result)=>{
                    qrScanner.clear()
                    // qrScanner.stop()
                    setIsScanning(true)
                    compareTime(result)
                    
                    
                }

                const error=(error)=>{
                    console.log(error)
                    // alert(error)
                }  
            
                // Start scanning
                qrScanner.render(success, error);
        }    
        
      };

    function delay(ms) {
        // setTimeout(console.log("2 secs"),ms)
        // return(setTimeout(()=>{}, ms))
        
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
    const compareTime= async (result)=>{
        
        const attendance= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getAttendance?attendanceId=${result}`,{withCredentials:true})
        console.log(result)
        if(attendance.data!==null){
            const now=new Date()
            const end= new Date(attendance.data.endSched)
            const start= new Date(attendance.data.startSched)
            const startTemp= new Date(attendance.data.startSched)
            const late= new Date(startTemp.setMinutes(startTemp.getMinutes()+15))

            console.log(now,end)
            console.log(address)
            let addressHolder=address
            if(address===null){
                addressHolder=`lat:${location.coordinates.lat} lng:${location.coordinates.lng}`
            }

            if(now<start){

                // alert("Class hasn't started yet")
                setOpenSnack(true)
                setOpenSnackbarLabel("Class hasn't started yet")
                setSuccess('error')
            }else{
               
                let body={}
                if(now>end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Absent", date:now.toString(),location:addressHolder} //address
                }else if(now>late && now<=end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Late", date:now.toString(),location:addressHolder}
                }else if(now<=late  && now<=end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Present", date:now.toString(),location:addressHolder}
                }
                
                
                const duplicate=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/checkDuplicateAttendance?studentId=${user.data.id}&attendanceCollectionId=${attendance.data._id}`,{withCredentials:true})
                console.log(duplicate)
                if(duplicate.data===null){
                    const record=await axios.post(`${process.env.REACT_APP_API_SERVER}/api/recordAttendance`,body,{withCredentials:true})
                    // alert(record.data)
                    setOpenSnack(true)
                    setOpenSnackbarLabel("Successfully recorded attendance")
                    setSuccess('success')
                }else{
                    setOpenSnack(true)
                    setOpenSnackbarLabel("You already recorded your attendance")
                    setSuccess('warning')
                    
                }
                
                

                
            }
        //}
        }else{
            console.log("does not exist")
        }  

        


    }
    if(user){

        return(
            <>
            <Typography variant='h6' sx={{textAlign:"center", marginTop:10}}>Scan QR Code to record attendance</Typography>
            <Button variant="contained" sx={{margin:2,backgroundColor:"#00563F",'&:hover': { backgroundColor: '#8D1436'}}} onClick={startTimeout}>Scan</Button>
            <div id="scanner"></div>
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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically
                    height: '10vh', // Full viewport height
                    // border: '1px solid black',
                }}>
               
                    
                    {circularTimer?<Typography >Getting location ...</Typography>:<></>}
                
                </Box>
            </>
        )
    
    }else{
        return(
            <CircularProgress></CircularProgress>
        )
    }

}

export default ScanQR;