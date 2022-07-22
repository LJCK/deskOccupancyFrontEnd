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
import axios from 'axios';

const DropDownInput = ({locationState,levelState}) => {
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  
  const [newDesk, setNewDesk]= useState({
    "location":'', "level": '', "id": ''
  })

  const handleChange = (e) => {
    e.preventDefault()
    setNewDesk({...newDesk,[e.target.name]:e.target.value})
  };

  const handleSubmit=()=>{
    let id = `${newDesk['location']}_${newDesk['level']}_${newDesk['id']}`
    const newDeskObj = {
      id : {
        'expiryTime':null
      }
    }
    axios.post()
    console.log(newDeskObj)
    setNewDesk({"location":'', "level": '', "id": ''})
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <form onSubmit={handleSubmit}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <FormControl fullWidth>
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
            {Object.keys(locations).map((location, index)=>{
              return <MenuItem key={index} value={locations[location]}>{location}</MenuItem>
            })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
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

          <FormControl fullWidth>
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