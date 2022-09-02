import React, { useState } from 'react'
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

const DropDownInput = ({locationState, levelState, mqttClient, rerender, setRerender, config}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
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
      }).catch((error)=>{customAlert(error.response, "error")})
      setNewDesk({"location":'', "level": '', "id": ''})
  }

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
  }

  const pairDevice=(id)=>{
    mqttClient.removeAllListeners("message")
    mqttClient.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      if (topic == "zigbee2mqtt/bridge/event" && msg.type == "device_interview") {
        switch (msg.data.status) {
          case "started":
            customAlert(`${id} Device interview commencing. Please wait...`, "success")
            break;
          case "failed":
            customAlert("Pairing fail", "error")
            break;
          case "successful": //on pairing...
            let friendly_name = msg.data.friendly_name;
            mqttClient.publish("zigbee2mqtt/bridge/request/device/rename", `{ "from": "${friendly_name}", "to": "devices/${id}" }`)
            customAlert(`Device ${id} rename success`, "success")
            setRerender(!rerender)
            break;
        }
      } 
    });
  }

  return (
    <Box>
      
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
            />
          </FormControl>

          <Button type='submit' variant="outlined">Submit</Button>
        </Stack>
      </form>
    </Box>
  )
}

export default DropDownInput