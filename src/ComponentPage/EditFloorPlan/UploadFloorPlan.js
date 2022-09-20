import React,{useState,useRef, useEffect} from 'react'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import {useSnackbar} from "notistack"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';

const UploadFloorPlan = ({locationState,levelState, rerender, setRerender, config}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [floorPlan, setFloorPlan]= useState({
    "location":"", "level": "", "floorPlan": ""
  })
  const {user} = useAuthContext()
  const { logout } = useLogout()

  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const previousValue = useRef(null);

  

  // handle drag events
  const handleDrag = (e)=> {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFloorPlan({...floorPlan,['floorPlan']:e.dataTransfer.files[0]})
      
    }
  };
  
  // triggers when file is selected with click
  const handleUploadChange = (e)=>{
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFloorPlan({...floorPlan,['floorPlan']:e.target.files[0]})
      
    }
  };

  // triggers the input when the button is clicked
  // const onButtonClick = () => {
  //   if(floorPlan["floorPlan"] != ""){
  //     inputRef.current.click();
  //   }
  // };

  const handleSubmit=(e)=>{
    e.preventDefault();
    const newFloorPlanObj = new FormData()
    // example of id: nva_8_floor_plan. Novena Tower A, level 8.
    let id = `${locations[floorPlan['location']]}_${floorPlan['level']}_floor_plan`
    newFloorPlanObj.append('UID',id)
    newFloorPlanObj.append('location',floorPlan['location'])
    newFloorPlanObj.append('level',floorPlan['level'])
    newFloorPlanObj.append("file",floorPlan['floorPlan'])
    if(user){
      axios.post(`${process.env.REACT_APP_API_URL}/floorPlan/uploadImage`, newFloorPlanObj,{
      headers:{
        "Content-Type":"multipart/form-data",
        "Authorization" : `Bearer ${user.token}`
      }
    }).then((res)=>{
      console.log(res.data)
      setRerender(!rerender)
      setFloorPlan({"location":'', "level": '', "floorPlan": ''})
    }).catch((error)=>{
      console.log(error.response.data.toString())
      if(error.response.data.error === "Your login session has expired."){
        customAlert(error.response.data.error, "error")
        logout()
      }else{
        customAlert(error.response.data, "error")
      }
      setFloorPlan({"location":'', "level": '', "floorPlan": ''})    
    })
    }
    
  }

  const handleFormChange=(e)=>{
    e.preventDefault();
    setFloorPlan({...floorPlan,[e.target.name]:e.target.value})
    console.log(floorPlan)
  }

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
  }

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <Stack
          direction={config}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={floorPlan.location}
              name="location"
              label="Location"
              onChange={handleFormChange}
              required
            >
            {Object.keys(locations).map((key, index)=>{
              return <MenuItem key={index} value={key}>{key}</MenuItem>
            })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Level</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={floorPlan.level}
              name="level"
              label="Level"
              onChange={handleFormChange}
              required
            >
            {Object.keys(levels).map((level, index)=>{
              return <MenuItem key={index} value={levels[level]}>{level}</MenuItem>
            })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
          {/* ref={inputRef} */}
            <input type="file" id="input-file-upload" onChange={handleUploadChange} name="floorPlan" hidden required/>
            <label htmlFor={floorPlan["floorPlan"]["name"]? "" : "input-file-upload" }>
              <Box display={"flex"} justifyContent={"center"} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} sx={{ border: '2px dashed grey', borderRadius: 4}}>
                
                <h4 style={{textDecoration:"none"}}>Drag or Click to upload</h4>
  
              </Box> 
            </label>
            {
              floorPlan["floorPlan"]["name"] && 
              <Chip label ={floorPlan["floorPlan"]["name"]} onDelete={()=>{setFloorPlan({...floorPlan,['floorPlan']:""})}}/>
            }
          </FormControl>
          <Button type='submit' variant="outlined">Submit</Button>
        </Stack>
      </form>
    </div>
  )
}

export default UploadFloorPlan