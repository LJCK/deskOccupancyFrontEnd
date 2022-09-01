import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useSnackbar} from "notistack"
import axios from 'axios';

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
  mqttClient.publish("zigbee2mqtt/bridge/request/permit_join", '{ "value": true }', { "qos": 1 });
  mqttClient.subscribe('zigbee2mqtt/bridge/event')
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

// const pairDevice=(id)=>{
//   mqttClient.on('message', (topic, payload) => {
//     const msg = JSON.parse(payload.toString());
//     if (topic == "zigbee2mqtt/bridge/event" && msg.type == "device_interview") {
//       // const [reply, setReply] = useState({
//       //   "message":"", "status":""
//       // })
//       switch (msg.data.status) {
//         case "started":
//           // setReply({"message":"Device interview commencing. Please wait...", "status":"success"})
//           console.log("Device interview commencing. Please wait... (You might see this multiple times as device pairs)");
//           break;
//         case "failed":
//           // device.publish("zigbee2mqtt/bridge/request/permit_join", '{ "value": false }');
//           // setReply({"message":"Pairing fail", "status":"error"})
//           console.log("Pairing fail")
//           break;
//         case "successful": //on pairing...
//           let friendly_name = msg.data.friendly_name;
//           let new_friendly_name = id
//           if (new_friendly_name != "") {
//             mqttClient.publish("zigbee2mqtt/bridge/request/device/rename", `{ "from": "${friendly_name}", "to": "devices/${new_friendly_name}" }`)
//           }
//           // setReply({"message":"Device rename success", "status":"success"})
//           console.log("Device rename success")
//           break;
//       }
//       // return reply
//     } 
//   });
// }


const DropDownInput = ({locationState,levelState, config}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [showForm, setShowForm] = useState(true)
  const [newDesk, setNewDesk]= useState({
    "location":'', "level": '', "id": ''
  })

  const handleChange = (e) => {
    e.preventDefault()
    setNewDesk({...newDesk,[e.target.name]:e.target.value})
  };

const handleSubmit=(e)=>{
  e.preventDefault()
  // example of id: nva_8_1. Novena Tower A, level 8, table 1.
  let id = `${locations[newDesk['location']]}_${newDesk['level']}_${newDesk['id']}`
  let location = newDesk['location']

  customAlert("Trying to connect to the IoT hub.","info")

  const newDeskObj = {
    deskID:id,
    location: location,
    locationID: `${locations[newDesk['location']]}_${newDesk['level']}`,
    level: newDesk['level']
  }

  axios.post("http://localhost:3001/desk/addDesk", newDeskObj).then((res)=>{
    if(res.status === 200){
      customAlert(res.data,"success")
      pairDevice(id)
      }
    }).catch((error)=>{customAlert(error.response.data, "error")})
    setNewDesk({"location":'', "level": '', "id": ''})
  }

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
  }

  const pairDevice=(id)=>{
    mqttClient.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      if (topic == "zigbee2mqtt/bridge/event" && msg.type == "device_interview") {
        switch (msg.data.status) {
          case "started":
            customAlert("Device interview commencing. Please wait...", "success")
            break;
          case "failed":
            customAlert("Pairing fail", "error")
            break;
          case "successful": //on pairing...
            let friendly_name = msg.data.friendly_name;
            let new_friendly_name = id
            if (new_friendly_name != "") {
              mqttClient.publish("zigbee2mqtt/bridge/request/device/rename", `{ "from": "${friendly_name}", "to": "devices/${new_friendly_name}" }`)
            }
            customAlert("Device rename success", "success")
            break;
        }
        // return reply
      } 
    });
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      
      <form onSubmit={handleSubmit}>
        <Stack
          direction={config}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDesk.location}
              name="location"
              label="Location"
              onChange={handleChange}
              required
              disabled={!showForm}
            >
            {Object.keys(locations).map((key, index)=>{
              return <MenuItem key={index} value={key}>{key}</MenuItem>
            })}
            </Select>
          </FormControl>

          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Level</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDesk.level}
              name="level"
              label="Level"
              onChange={handleChange}
              required
              disabled={!showForm}
            >
            {Object.keys(levels).map((level, index)=>{
              return <MenuItem key={index} value={levels[level]}>{level}</MenuItem>
            })}
            </Select>
          </FormControl>

          <FormControl fullWidth >
            <TextField
              required
              id="outlined-required"
              name="id"
              label="Table ID"
              value={newDesk.id}
              onChange={handleChange}
              disabled={!showForm}
            />
          </FormControl>

          <Button type='submit' variant="outlined" disabled={!showForm}>Submit</Button>
        </Stack>
      </form>
    </Box>
  )
}

export default DropDownInput