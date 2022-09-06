import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ImageIcon from '@mui/icons-material/Image';
import SpeedDial from '@mui/material/SpeedDial';
import { red, green } from '@mui/material/colors';
import axios from 'axios'
import { Box } from "@mui/material";
import Modal from '@mui/material/Modal';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const AWS = require("aws-sdk");
const AWSIoTData = require('aws-iot-device-sdk');

let awsConfig = {
  identityPoolId: "ap-southeast-1:f187afe2-9cd1-4678-9dc2-9ab7d0b98589",
  mqttEndpoint: "a2x864rhawhdg9-ats.iot.ap-southeast-1.amazonaws.com",
  region: "ap-southeast-1",
  clientId: "5ais045mjjoctk8vcmknkpq85t",
  userPoolId: "ap-southeast-1_PXBqmAstk"
};

const mqttClient = AWSIoTData.device({
  region: awsConfig.region,
  host: awsConfig.mqttEndpoint,
  clientId: awsConfig.clientId,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: '',
  secretKey: '',
  sessionToken: ''
});

AWS.config.region = awsConfig.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: awsConfig.identityPoolId
});

AWS.config.credentials.get((err) => {
  if (err) {
      console.log(AWS.config.credentials);
      throw err;
  } else {
      mqttClient.updateWebSocketCredentials(
          AWS.config.credentials.accessKeyId,
          AWS.config.credentials.secretAccessKey,
          AWS.config.credentials.sessionToken
      );
  }
});

mqttClient.on('connect', () => {
  console.log('mqttClient connected')
  mqttClient.subscribe('zigbee2mqtt/bridge/event')
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

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

const DisplayTableStatus=()=>{

  const [tableStatus,setTableStatus] = useState([])
  const [occupencyRatio, setOccupencyRatio] = useState()
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

  // useEffect(()=>{
  //   axios.get(`http://localhost:3001/desk/getDeskStatus?level=${id}`).then((res)=>{
  //   setOccupencyRatio(res.data.occupencyRatio)  
  //   setTableStatus(res.data.tables.desks)
  //   })
  // },[id,reload])

  return (
    <div>
    <Grid  container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent={"center"}>
      <Grid item xs={11} >
        <h1>Level {id.split("_").at(-1)}</h1>
        <h5>{occupencyRatio +"% occupied" }</h5>
      </Grid>
      
      {tableStatus.map((item,index)=>{
        return <Grid item xs={6} sm={4} md={3} key={index} component={Paper} >
          {item["status"] ==="unoccupied" ? <TableRestaurantIcon sx={{color:green[500], fontSize: 40}}/> :<TableRestaurantIcon sx={{color:red[500], fontSize: 40}}/>}
          
          <h3>Table: {item.deskID.split("_").at(-1)}</h3>
          
          <h3>Status: {item.status}</h3>
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