import React,{useState,useRef} from 'react'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

const UploadFloorPlan = ({locationState,levelState}) => {

  const [locations,setLocations]= useState(locationState)
  const [levels,setLevels] = useState(levelState)
  const [floorPlan, setFloorPlan]= useState({
    "location":'', "level": '', "floorPlan": ''
  })

  // drag state
  const [dragActive, setDragActive] = useState(true);
  // ref
  const inputRef = useRef(null);

  // // handle drag events
  // const handleDrag = (e)=> {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === "dragenter" || e.type === "dragover") {
  //     setDragActive(true);
  //   } else if (e.type === "dragleave") {
  //     setDragActive(false);
  //   }
  // };

  // triggers when file is dropped
  const handleDrop = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFloorPlan({...floorPlan,['floorPlan']:e.dataTransfer.files})
      console.log(floorPlan)
    }
  };

  // triggers when file is selected with click
  const handleUploadChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFloorPlan({...floorPlan,['floorPlan']:e.target.files})
      console.log(floorPlan)
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleSubmit=()=>{

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
          direction="row"
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
            {Object.keys(locations).map((location, index)=>{
              return <MenuItem key={index} value={location}>{location}</MenuItem>
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
            <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleUploadChange} />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
              <div id="drag-file-element" onDrop={handleDrop}>
                {/* <h5></h5> */}
                <button className="upload-button" onClick={onButtonClick}>Drag and drop your file here or Upload a file</button>
              </div> 
            </label>
            {/* { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> } */}
          </FormControl>
          <Button type='submit' variant="outlined">Submit</Button>
        </Stack>
      </form>
    </div>
  )
}

export default UploadFloorPlan