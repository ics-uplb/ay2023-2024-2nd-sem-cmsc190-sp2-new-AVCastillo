import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {Box,Button, Typography} from '@mui/material'
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
    let qrScanner = null;

    // const [address,setAddress]=useState(null)

    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
    });


    const reverseGeocodeOSM = async (lat, lng) => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
          const response = await axios.get(url,{withCredentials:true});
          setAddress(response.data.display_name)
        
        //   setAddress(response.data.display_name)
        //   return response.data.display_name; // Returns the full address
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
        reverseGeocodeOSM(location.coords.latitude,location.coords.longitude)

    };

    const onError = error => {
        setLocation({
            loaded: true,
            error,
        });
    };


    useEffect(()=>{

        async function getUser(){
            const student = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});
            dispatchUser({type:'SET_USER',payload:student})

        }

        getUser()

         //get location
        const geoOptions = {
            maximumAge: 30000,
            timeout: 5000,
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


    const startScanning = () => {

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
                    // compareTime(result)
                    // setScannedResult(result)
                    
                }

                const error=(error)=>{
                    console.log(error)
                }  
            
                // Start scanning
                qrScanner.render(success, error);
        }    
        
      };

      
    const compareTime= async (result)=>{
        const attendance= await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getAttendance?attendanceId=${result}`,{withCredentials:true})

        if(attendance.data!==null){
            const now=new Date()
            const end= new Date(attendance.data.endSched)
            const start= new Date(attendance.data.startSched)
            const startTemp= new Date(attendance.data.startSched)
            const late= new Date(startTemp.setMinutes(startTemp.getMinutes()+15))

            if(now<start){

                alert("Class hasn't started yet")
            }else{
                let body={}
                if(now>end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Absent", date:now.toString(),location:address}
                }else if(now>late && now<=end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Late", date:now.toString(),location:address}
                }else if(now<=late  && now<=end){
                    body={attendanceCollectionId:attendance.data._id,studentId:user.data.id,status:"Present", date:now.toString(),location:address}
                }
                
                
                const duplicate=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/checkDuplicateAttendance?studentId=${user.data.id}&attendanceCollectionId=${attendance.data._id}`,{withCredentials:true})

                if(duplicate.data===null){
                    const record=await axios.post(`${process.env.REACT_APP_API_SERVER}/api/recordAttendance`,body,{withCredentials:true})
                }else{
                    console.log("You already recorded your attendance")
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
            <Button variant="contained" sx={{margin:2,backgroundColor:"#00563F",'&:hover': { backgroundColor: '#8D1436'}}} onClick={startScanning}>Scan</Button>
            <div id="scanner"></div>
            </>
        )
    
    }else{
        return(
            <CircularProgress></CircularProgress>
        )
    }

}

export default ScanQR;