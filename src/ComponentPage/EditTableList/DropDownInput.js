import React, { useState } from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useSnackbar} from "notistack"
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';

const DropDownInput = ({locationState, levelState, mqttClient, rerender, setRerender, config}) => {

  const {user} = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [newSensor, setNewSensor]= useState({
    "location":'', "level": '', "id": '', "sensorType":''
  })
  const { logout } = useLogout()

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
  }

  const handleChange = (e) => {
    e.preventDefault()
    setNewSensor({...newSensor,[e.target.name]:e.target.value})
  };

  const handleSubmit=(e)=>{
    e.preventDefault()

    let id = `${locations[newSensor['location']]}_${newSensor['level']}_${newSensor['sensorType']}_${newSensor['id']}`
    
    const newSensorObj = {
      sensorID:id,
      location: newSensor['location'],
      locationID: `${locations[newSensor['location']]}_${newSensor['level']}`,
      level: newSensor['level'],
      sensorType: newSensor['sensorType']
    }

    if(user) {
      axios.post("http://localhost:3001/sensor/addSensor", newSensorObj, {headers: {"Authorization" : `Bearer ${user.token}`}} ).then((res)=>{
      if(res.status === 200){
        customAlert(res.data,"success")
        setRerender(!rerender)
        }
      }).catch((error)=>{
        if(error.response.data.error === "Your login session has expired."){
          customAlert(error.response.data.error, "error")
          logout()
        }else{
          console.log("this is the error",error)
          customAlert("error here", "error")
        }
      })
    }
    
    setNewSensor({"location":'', "level": '', "id": ''})

    // customAlert("Trying to connect to the IoT hub.","info")
    // mqttClient.publish("zigbee2mqtt/bridge/request/permit_join", '{ "value": true }', { "qos": 1 });
    // mqttClient.on('message', messageCallBack)

    // console.log("listener is up and running.")
    // customAlert("Hub connected, please press and hold the button on the sensor until it stop blinking.", "success")
  }

  function updateDB(){
    console.log("new sensor ", newSensor)
    let id = `${locations[newSensor['location']]}_${newSensor['level']}_${newSensor['sensorType']}_${newSensor['id']}`
    const newSensorObj = {
      sensorID:id,
      location: newSensor['location'],
      locationID: `${locations[newSensor['location']]}_${newSensor['level']}`,
      level: newSensor['level'],
      sensorType: newSensor['sensorType']
    }
    if(user){
      axios.post("http://localhost:3001/sensor/addSensor", newSensorObj, {headers: {"Authorization" : `Bearer ${user.token}`}}).then((res)=>{
      if(res.status === 200){
        customAlert(res.data,"success")
        setRerender(!rerender)
        }
      }).catch((error)=>{
        if(error.response.data.error === "Your login session has expired."){
          customAlert(error.response.data.error, "error")
          logout()
        }else{
          customAlert(error.response.data, "error")
        }
      })
      setNewSensor({"location":'', "level": '', "id": ''})
    }
    
  }
  
  function messageCallBack (topic, payload) {
    const msg = JSON.parse(payload.toString());
    let id = `${locations[newSensor['location']]}_${newSensor['level']}_${newSensor['sensorType']}_${newSensor['id']}`

    if (topic === "zigbee2mqtt/bridge/event" && msg.type === "device_interview") {
      switch (msg.data.status) {
        case "started":
          customAlert(`Device interview commencing. Please wait further instruction...`, "success")
          break;
        case "failed":
          customAlert("Pairing fail", "error")
          break;
        case "successful": //on pairing...
          updateDB()
          let friendly_name = msg.data.friendly_name;
          mqttClient.publish("zigbee2mqtt/bridge/request/device/rename", `{ "from": "${friendly_name}", "to": "devices/${id}" }`) 
          customAlert(`Device ${id} rename success`, "success")
          mqttClient.publish("zigbee2mqtt/bridge/request/permit_join", '{ "value": false }');
          mqttClient.removeAllListeners("message")
          break;
        default:
          mqttClient.publish("zigbee2mqtt/bridge/request/permit_join", '{ "value": false }');
          mqttClient.removeAllListeners("message")
          break;

      }
    }
  };

  return (
    <Box >
      <Grid container spacing={2} columns={{xs:12}}>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newSensor.location}
              name="location"
              label="Location"
              onChange={handleChange}
              required
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
              value={newSensor.level}
              name="level"
              label="Level"
              onChange={handleChange}
              required
            >
            {Object.keys(levels).map((level, index)=>{
              return <MenuItem key={index} value={levels[level]}>{level}</MenuItem>
            })}
            </Select>
          </FormControl>
          </Grid>
          
          <Grid item xs={6}>
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Sensor Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newSensor.sensorType}
              name="sensorType"
              label="Sensor Type"
              onChange={handleChange}
              required
            >
              {/* can change these menu item to an array */}
              <MenuItem value={"vibration"}>Vibration</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
              <MenuItem value={""}></MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth >
            <TextField
              required
              id="outlined-required"
              name="id"
              label="Sensor ID"
              value={newSensor.id}
              onChange={handleChange}
              type ="number"
            />
          </FormControl>
          </Grid>
          <Button type='submit' variant="outlined">Submit</Button>
        </form>
      </Grid>
    </Box>
  )
}

export default DropDownInput