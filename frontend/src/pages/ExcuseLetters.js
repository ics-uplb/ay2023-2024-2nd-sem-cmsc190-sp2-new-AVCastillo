import axios from 'axios'
import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom';
import { Grid, Button, Box,Stack } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {CircularProgress} from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ExcuseLetters=()=>{
    // const [pdfBuffer,setPdfBuffer]=useState(null)
    const [pdfUrl, setPdfUrl] = useState(null);
    const {classId}=useParams()
    const [pdfFileName,setPdfFileName]=useState(null)
    const [pdfFileDate,setPdfFileDate]=useState(null)
    const [finishRendering,setFinish]=useState(false)

    useEffect(()=>{
      
      async function getLetters(){
        const indivs= await axios.get(`/api/getAllIndivAttendances?classId=${classId}`,{withCredentials:true})
        let pdfArray=[]
        let pdfNameArray=[]
        let dateSubmitArray=[]
        console.log(indivs)
        for (const indiv of indivs.data){
          const letter = await axios.get(`/api/getClassExcuseLetters?indivAttendanceId=${indiv._id}`,{
                responseType: 'blob'},{withCredentials:true})
          if(letter.data.size!==0){
            const pdfName= await axios.get(`/api/getPdfName?indivAttendanceId=${indiv._id}`,{withCredentials:true})
            pdfArray.push(letter.data)
            dateSubmitArray.push(pdfName.data.dateSubmitted)
            pdfNameArray.push(pdfName.data.name)
           
        }
        setPdfFileName(pdfNameArray)
        setPdfFileDate(dateSubmitArray)
      }

        let blobArrayToUrl=[]

        for(const pdf of pdfArray){
            const url= URL.createObjectURL(pdf)
            blobArrayToUrl.push(url)
        }
        setPdfUrl(blobArrayToUrl)
        setFinish(true)
 
      }
      getLetters()
      

    },[])



    const handleOpenPDF = (url) => {
      window.open(url, '_blank');
      // const url = URL.createObjectURL(url);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'test.pdf';
      // link.click();``
      // Optional: cleanup the blob URL after it's no longer needed
      // URL.revokeObjectURL(url);
  };

  if(finishRendering){
    return(
      // <div>
      //   {pdfUrl.map((result,index)=>(
      //     <Box>
      //       <Button onClick={()=>{handleOpenPDF(result)}} key={index}>{pdfFileName[index]}</Button>
      //       <div>{pdfFileDate[index]}</div>
      //     </Box>
          
      //   ))}
      // </div>


      <Box sx={{ width: "100%" }} >
        <List>
            {pdfUrl.map((pdf, index) => (
            <ListItem key={index} disablePadding>
                <ListItemButton onClick={()=>{handleOpenPDF(pdf)}}>
                  <ListItemIcon ><PictureAsPdfIcon sx={{fontSize:30}}/></ListItemIcon>
                    {/* <ListItemIcon>{pdf.type==="Fraud"?<WarningIcon sx={{fontSize:40,color:"#8D1436"}}/>:<CircleNotificationsIcon sx={{fontSize:40,color:"#FFB61C"}}/>}</ListItemIcon> */}
                <Stack direction="column">
                  <ListItemText primary={pdfFileName[index]} />
                  <ListItemText primary={"Submitted: "+pdfFileDate[index]} />
                  
                </Stack>
                
                </ListItemButton>
                
            </ListItem>
            ))}
        </List>
      </Box>
      // <button onClick={handleOpenPDF}>Open PDF</button>
      // <div>
      // {pdfUrl ? <iframe src={pdfUrl} style={{ width: '100%', height: '100vh' }} /> : <p>Loading...</p>}
      // </div>
    )
  }else{
    return(
      <Box >
        <CircularProgress ></CircularProgress>
      </Box>
      
    )
  }



}





export default ExcuseLetters;