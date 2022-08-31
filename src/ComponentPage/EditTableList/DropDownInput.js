import React, {useState} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import {useSnackbar} from "notistack"
import axios from 'axios';

const DropDownInput = ({locationState,levelState, config}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [showForm, setShowForm] = useState(false)
  const [newDesk, setNewDesk]= useState({
    "location":'', "level": '', "id": ''
  })

  const handleChange = (e) => {
    e.preventDefault()
    setNewDesk({...newDesk,[e.target.name]:e.target.value})
  };

  const enableForm=()=>{
    customAlert("Trying to connect the IoT Hub, please be patient", 'info')
    axios.post("http://localhost:3001/desk/permitJoin").then((res)=>{
    if(res.status === 200){
      setShowForm(true)
      customAlert("(2)Press and hold the button on the sensor until the blinking light stops", 'info')
      customAlert("(1)You need to be physically beside the IoT Hub.", 'info')
      customAlert("You may now pair your device, please follow the following steps.", 'info')
    }
    }).catch(error=>{customAlert(error.response.data,"error")})
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    let id = `${locations[newDesk['location']]}_${newDesk['level']}_${newDesk['id']}`
    let location = newDesk['location']
    const newDeskObj = {
      deskID:id,
      location: location,
      locationID: `${locations[newDesk['location']]}_${newDesk['level']}`,
      level: newDesk['level']
    }
    axios.post("http://localhost:3001/desk/pairDevice", newDeskObj).then((res)=>{
      if(res.status === 200){
        customAlert(res.data,"success")
      }
    }).catch((error)=>{customAlert(error.response.data, "error")})
    setNewDesk({"location":'', "level": '', "id": ''})
    setShowForm(false)
  }

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
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
      <Switch
      checked={showForm}
      onChange={enableForm}
      inputProps={{ 'aria-label': 'controlled' }}
      />add device
    </Box>
  )
}

export default DropDownInput