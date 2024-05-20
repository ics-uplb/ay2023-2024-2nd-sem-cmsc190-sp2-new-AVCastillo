import {useParams} from 'react-router-dom';
import axios from 'axios';
import{useState,useEffect} from 'react'
import { useUserContext } from "../hooks/useUserContext";
import {Box,Button,Grid,IconButton,Dialog,Stack} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';

import TeacherRecord from './TeacherRecords';
// const options = ['Option 1', 'Option 2', 'Option 3'];



const TeacherRecord2=()=>{
    const {classId}=useParams()
    // const {user,dispatchUser}= useUserContext()
    const[userId,setUserId]=useState(null)
    const[records,setRecords]=useState(null)
    // const [rows,setRows]=useState(null)
    const [details,setDetails]=useState(false)
    const [dateRecorded,setDateRecorded]=useState('')
    const [status,setStatus]=useState('')
    const [options,setOptions]=useState(null)
    const [searchHolder,setSearchHolder]=useState(null)
    const [attendanceArray, setAttendanceArray]=useState(null)
    const [columns,setColumns]=useState(null)
    const [className,setClassName]=useState(null)
    const [section,setSection]=useState(null)
    const [t2view,setT2View]=useState(true)
    

    useEffect(()=>{
        async function getUser(){
            const user=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/getProfile`,{withCredentials:true});
            const attendance=await axios.get(`${process.env.REACT_APP_API_SERVER}/api/displayTRecords2?classId=${classId}`,{withCredentials:true})
            setClassName(attendance.data.className)
            setSection(attendance.data.section)

            
            if((attendance.data.attendance).length!==0){
                let attendanceRecord=[]

                attendance.data.attendance.forEach((element,index)=>{
                    let attendanceObj={}
                    element.forEach((element2,index2)=>{
                        attendanceObj["name"]=element2.name
                        attendanceObj["status"+index2.toString()]=element2.status
                })
                attendanceObj["id"]=index
                attendanceRecord.push(attendanceObj)
                })
                const attendanceRec=attendance.data.attendance[0]

                let temp=[
                    {
                        field: 'name',
                        headerName: 'Name',
                        width: 150,
                        editable: true,
                        filterable:false,
                        sortable:false,
                        pinning:{position:"right"}
                    }
                ]
                for(let i=0;i<attendanceRec.length;i++){
                    const date=new Date(attendanceRec[i].searchDate)
                    const converted=date.toLocaleDateString('en-US', { weekday: 'short',year: 'numeric', month: 'short', day: 'numeric' })
                    const columnField={
                        field: 'status'+i.toString(),
                        headerName: converted,
                        width: 150,
                        editable: true,
                        filterable:false,
                        sortable:false
                    }
                    temp.push(columnField)
                }
                setColumns(temp)
                setAttendanceArray(attendanceRecord)
           
            }
        }
        getUser()
    },[])


    const closeDetails=()=>{
      setDetails(false)
    }

    const handleDownload=()=>{

        const headers = columns.map(col => col.headerName); // Extract headers from columns
        const data = attendanceArray.map(row => {
            return columns.map(col => row[col.field]); // Create row data based on column order
        });
      
        
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

        // Define border styles
        const borderStyle = {
            top: { style: "thick", color: { rgb: "000000" } },
            left: { style: "thick", color: { rgb: "000000" } },
            bottom: { style: "thick", color: { rgb: "000000" } },
            right: { style: "thick", color: { rgb: "000000" } }
        };

         // Apply borders to all cells
        const range = XLSX.utils.decode_range(worksheet['!ref']); // Decode the range of cells in the worksheet
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = {c: C, r: R};
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!worksheet[cell_ref]) continue; // Skip if cell doesn't exist
                worksheet[cell_ref].s = {
                    border: borderStyle
                };
            }
        }
        
        const workbook = XLSX.utils.book_new();
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        
        // Write the workbook and initiate download
        XLSX.writeFile(workbook,`${className}-${section}-Attendance.xlsx`);
    }
    
    const changeView=()=>{
        setT2View(false)
    }


       if(columns!==null){
        if(t2view){
            return(
                <>
                <Grid container sx={{paddingTop:3,paddingBottom:3}}columns={{xs:12, sm:16, md:24, lg:32}}>
                  <Grid item xs={12} sm={16} md={8} lg={10}>
                  <Button onClick={changeView} sx={{width:"90%"}} variant='contained' fullWidth>Change View</Button>
                  </Grid>
                  
                </Grid>
            
                <Box sx={{ height: 400, width: '100%' ,}}>
                
                <Dialog
                    open={details}
                    onClose={closeDetails}
                >
                    <DialogTitle sx={{textAlign:"center"}}>Details</DialogTitle>
                    <DialogContent>

                    <DialogContentText>{status}</DialogContentText>
                    <DialogContentText>{dateRecorded}</DialogContentText>

                    </DialogContent>
                    </Dialog>
                    <DataGrid
                    rows={attendanceArray}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5 ,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    
                    disableRowSelectionOnClick
                    />
                    <Button sx={{color:'#00563F'}}onClick={handleDownload}>Download Excel</Button>
            </Box>
            </>
            )
        }else{
            return(
                <TeacherRecord/>
            )
        }
    // }else{
    //     return(
    //         <CircularProgress></CircularProgress>
    //     )
    // }
       }else{
         return(
            <div>no data</div>
         )
       }

}


export default TeacherRecord2;