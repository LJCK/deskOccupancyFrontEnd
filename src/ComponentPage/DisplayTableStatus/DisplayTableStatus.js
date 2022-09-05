import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ImageIcon from '@mui/icons-material/Image';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { red, green } from '@mui/material/colors';
import axios from 'axios'
import { Box } from "@mui/material";
import Modal from '@mui/material/Modal';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center'
};

const DisplayTableStatus=({isSideBarOpen})=>{

  const [tableStatus,setTableStatus] = useState([])
  const [floorPlan,setFloorPlan] = useState([])
  const [reload, setReload] = useState(false)
  const [open, setOpen] = React.useState(false);
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
  setTimeout(function() {
    setReload(!reload)
  }, 60000);

  useEffect(()=>{
    axios.get(`http://localhost:3001/desk/getDeskStatus?level=${id}`).then((res)=>{
    console.log(res.data.desks)  
    setTableStatus(res.data.desks)
    })
  },[id,reload])

  return (
    <div>
    <Grid  container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent={"center"}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <h1>Level {id}</h1>
      </Grid>
      
      {tableStatus.map((item,index)=>{
        return <Grid item xs={6} sm={4} md={3} key={index} component={Paper}>
          {item["status"] ==="unoccupied" ? <TableRestaurantIcon sx={{color:green[500], fontSize: 40}}/> :<TableRestaurantIcon sx={{color:red[500], fontSize: 40}}/>}
          
          <h3>Table: {item.deskID}</h3>
          <h3>Expiry Time: {item.expiryTime}</h3>
        </Grid>
      })}
    </Grid>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        { 
          floorPlan[0] === undefined? 
          <Box sx={style}>   <ImageNotSupportedIcon/>    <h3 style={{"textAlign": "center"}}>Floor Plan Not Exist</h3>
        </Box> : <Box sx={style}>

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