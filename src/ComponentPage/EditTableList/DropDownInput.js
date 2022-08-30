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
import Alert from '@mui/material/Alert';
import axios from 'axios';

const DropDownInput = ({locationState,levelState, config}) => {

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
    
    axios.post("http://localhost:3001/desk/permitJoin").then((res)=>{
    if(res.status == 200){
      setShowForm(true)
      alert(res.data)
    }
    })
  }

  const handleSubmit=()=>{
    let id = `${locations[newDesk['location']]}_${newDesk['level']}_${newDesk['id']}`
    let location = newDesk['location']
    const newDeskObj = {
      deskID:id,
      location: location,
      locationID: `${locations[newDesk['location']]}_${newDesk['level']}`,
      level: newDesk['level']
    }
    axios.post("http://localhost:3001/desk/pairDevice", newDeskObj).then((res)=>{
      if(res.status == 200){
        setShowForm(false)
        alert(res.data)
      }
    }).catch((error)=>{alert(error.response.data)})
    console.log(newDeskObj)
    setNewDesk({"location":'', "level": '', "id": ''})
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <Alert onClose={() => {}}>This is a success alert — check it out!</Alert>
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
            {locations.map((location, index)=>{
              return <MenuItem key={index} value={location.id}>{location.location}</MenuItem>
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