import React,{useState,useRef} from 'react'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';

const UploadFloorPlan = ({locationState,levelState, rerender, setRerender, config}) => {

  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [floorPlan, setFloorPlan]= useState({
    "location":"", "level": "", "floorPlan": ""
  })
  const [open, setOpen] = useState(false)
  const [alertText,setAlertText] = useState({
    "text":"", "severity":"success"
  })

  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

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
      console.log(floorPlan)
    }
  };

  // triggers when file is selected with click
  const handleUploadChange = (e)=>{
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFloorPlan({...floorPlan,['floorPlan']:e.target.files[0]})
      console.log(floorPlan)
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    const newFloorPlanObj = new FormData()
    // example of id: nva_8_floor_plan. Novena Tower A, level 8.
    let id = `${locations[floorPlan['location']]}_${floorPlan['level']}_floor_plan`
    newFloorPlanObj.append('UID',id)
    newFloorPlanObj.append('location',floorPlan['location'])
    newFloorPlanObj.append('level',floorPlan['level'])
    newFloorPlanObj.append("file",floorPlan['floorPlan'])
    axios.post("http://localhost:3001/floorPlan/uploadImage", newFloorPlanObj,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }).then((res)=>{
      console.log(res.data)
      setRerender(!rerender)
      setFloorPlan({"location":'', "level": '', "floorPlan": ''})
    }).catch((error)=>{
      console.log(error.response.data.toString())
      setFloorPlan({"location":'', "level": '', "floorPlan": ''})    
    })
  }

  const handleFormChange=(e)=>{
    e.preventDefault();
    setFloorPlan({...floorPlan,[e.target.name]:e.target.value})
    console.log(floorPlan)
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
            <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleUploadChange} name="floorPlan" required/>
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
              <Box id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} sx={{p:2}}>
                <a className="upload-button" onClick={onButtonClick} style={{textDecoration:"none"}}>Drag or Click to upload</a>
              </Box> 
            </label>
          </FormControl>
          <Button type='submit' variant="outlined">Submit</Button>
        </Stack>
      </form>
    </div>
  )
}

export default UploadFloorPlan