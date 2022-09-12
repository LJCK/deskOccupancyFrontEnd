import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

import ImageIcon from '@mui/icons-material/Image';
import SpeedDial from '@mui/material/SpeedDial';
import { red, green } from '@mui/material/colors';
import axios from 'axios'
import Typography from '@mui/material/Typography';
import { Box, tableSortLabelClasses } from "@mui/material";
import Modal from '@mui/material/Modal';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const floorPlanStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center'
};

// const desksStyle = {
//   bgcolor: {tableStatus[item]["status"] ==="unoccupied" ? red[500] : green[500]}
// }

const DisplayTableStatus=({mqttClient})=>{
  const [tableStatus,setTableStatus] = useState([])
  const [occupencyRatio, setOccupencyRatio] = useState()
  const [floorPlan,setFloorPlan] = useState([])
  const [reload, setReload] = useState(false)
  const [open, setOpen] = React.useState(false)

  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'))
  const lg = useMediaQuery(theme.breakpoints.down('lg'))
  const md = useMediaQuery(theme.breakpoints.down('md'))
  const sm = useMediaQuery(theme.breakpoints.down('sm'))
  const xs = useMediaQuery(theme.breakpoints.down('xs'))

  if(xl){
    console.log("windows up to xl")
  }else if(lg){
    console.log("windows down to lg")
  }else if(md){
    console.log("windows down to md")
  }else if(sm){
    console.log("windows down to sm")
  }else if(xs){
    console.log("windows down to xs")
  }

  const handleOpen = () => {
    setOpen(true);
    axios.get(`http://localhost:3001/floorPlan/getImage?filename=${id}`).then((res)=>{
      if (res.data[0] === null){
        setFloorPlan([])
      }else{
        setFloorPlan(res.data)
      }
    })
  }
  const handleClose = () => setOpen(false);

  const { id } = useParams()
  
  // setTimeout(function() {
  //   setReload(!reload)
  // }, 60000);

  useEffect(()=>{
    // mqttClient.on('message', messageCallBack)
    // function messageCallBack (topic,message){
    //   if(topic === `bumGoWhere/frontend/update/${id}`){
    //     const payload = JSON.parse(message)
    //     console.log(payload)
    //     setOccupencyRatio(payload.occupencyRatio)  
    //     setTableStatus(payload.tables.desks)
    //   }
    // }

    axios.get(`http://localhost:3001/desk/getDeskStatus?level=${id}`).then((res)=>{
    setOccupencyRatio(res.data.occupencyRatio) 
    if(res.data.tables.desks){
      const arr = res.data.tables.desks
      arr.sort(function(a,b){return a.deskID.localeCompare(b.deskID, undefined, {numeric:1})})
      setTableStatus(arr)
    } 
    })
  },[])

  // useEffect(()=>{
  //   axios.get(`http://localhost:3001/desk/getDeskStatus?level=${id}`).then((res)=>{
  //   setOccupencyRatio(res.data.occupencyRatio)  
  //   setTableStatus(res.data.tables.desks)
  //   })
  // },[id,reload])

  return (
    <div>
    <Grid  container spacing={{ xs: 2}}  justifyContent={"center"}>
      
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Typography variant="h4" >Welcome to <Typography variant="h4" sx={{textDecoration: 'underline'}} display="inline">Level {id.split("_").at(-1)}!</Typography></Typography >
      </Grid>

      <Grid item xs={12} md={6} display={"flex"} justifyContent={"center"}>
        <Paper sx={{borderRadius: 100, height : 200, width :200, display:"flex", justifyContent:"center", alignItems:"center"}}>
          <Typography variant="h5" display ={"flex"} justifyContent={"center"} >{occupencyRatio}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} display={"flex"} justifyContent={"center"}>
        <Grid container spacing={2} columns={{xs:5}}> 
          {tableStatus.map((item,index)=>{
            // if(item["sensorType"] != "vibration"){
            //   return
            // }

            return <Grid item xs={1} key={index} >
                <Paper sx={{bgcolor : item["status"] ==="unoccupied" ? green[500] : red[500], height: 60}}>{item["deskID"].split("_").at(-1)}</Paper>
              </Grid>
            
          })}
        </Grid>
      </Grid>
      
    </Grid>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        { 
          floorPlan[0] === undefined? 
          <Box sx={floorPlanStyle}>   <ImageNotSupportedIcon/>    <h3 style={{"textAlign": "center"}}>Floor Plan Not Exist</h3>
        </Box> : <Box sx={floorPlanStyle}>

          {floorPlan.map((singleData, index) => {
            const base64String = btoa(new Uint8Array(singleData.img.data.data).reduce(
              function (data, byte) {
                  return data + String.fromCharCode(byte);
              },
              ''
          ));
            return <img src={`data:image/png ;base64,${base64String}`} width="100%" key={index}/>
          })}
          <h3 style={{"textAlign": "center"}}>Floor Plan</h3>
        </Box>
        }
        
      </Modal>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<ImageIcon />}
        onClick = {handleOpen}
      >
      </SpeedDial>
    </div>
  )
}

export default DisplayTableStatus