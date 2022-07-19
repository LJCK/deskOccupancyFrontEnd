import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ImageIcon from '@mui/icons-material/Image';
import { red, green } from '@mui/material/colors';
import axios from 'axios'
import { Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24
};

const Table=()=>{

  const [tableStatus,setTableStatus] = useState([])
  const [floorPlan,setFloorPlan] = useState()
  const [reload, setReload] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    // axios.get(`http://localhost:3001/floorPlan/getImage?id=l${id}_floor_plan`).then((res)=>{
      // setFloorPlan(res.data)
      // console.log(res.data)
    // })
  }
  const handleClose = () => setOpen(false);

  const { id } = useParams()
  setTimeout(function() {
    setReload(!reload)
  }, 60000);

  useEffect(()=>{
    axios.get(`http://localhost:3001/desk/getDeskStatus?level=${id}`).then((res)=>{
      setTableStatus(res.data)
    })
  },[id,reload])

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={6} md={11}>
        <h1>Level {id}</h1>
      </Grid>
      <Grid item xs={6} md={1}>
        <ImageIcon fontSize="large" sx={{mt:3}} onClick={handleOpen}/>
      </Grid>
      
    </Grid>
    
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {tableStatus.map((item,index)=>{
        return <Grid item xs={2} sm={4} md={4} key={index}>
          {item[item.id] ==="unoccupied" ? <TableRestaurantIcon sx={{color:green[500], fontSize: 40}}/> :<TableRestaurantIcon sx={{color:red[500], fontSize: 40}}/>}
          
          <h3>Table: {item.id}</h3>
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
        <Box sx={style}>
          {/* <img src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960" alt="" /> */}
          <img src={`data:image/png;base64, MmM0ODg1MDg5YzM3MDVkZDZjZmY4N2U3YTJhNjg4NjQ=`} alt="" />
          <h3 style={{"textAlign": "center"}}>Floor Plan</h3>
        </Box>
      </Modal>
      
    </>
  )
}

export default Table