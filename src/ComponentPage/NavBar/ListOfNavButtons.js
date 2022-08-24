import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SensorsIcon from '@mui/icons-material/Sensors';
import ImageIcon from '@mui/icons-material/Image';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import allLocations from '../../Constants/locations.json'
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import React,{useState} from 'react'
import axios from 'axios'

const ListOfNavButtons =()=>{

  let navigate = useNavigate();

  const [locations, setLocations] = useState(allLocations)
  const [url,setUrl] = useState("")
  const [levels, setLevels] = useState([])
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [levelAnchorEl, setLevelAnchorEl] = useState(null);

  const showLocation = (e) => {
    setLocationAnchorEl(e.currentTarget);
  };

  const showLevel = (event,location, id) => {
    setLevelAnchorEl(event.currentTarget)
    setUrl(id)
    axios.get(`http://localhost:3001/desk/getAllLevels?location=${location}`).then((res)=>{setLevels(res.data)})
  }

  const handleClose = () => {
    setLocationAnchorEl(null);
    setLevelAnchorEl(null)
  };

  const URLredirect =(level)=>{
    navigate(`/${url}_${level}`);
    setLocationAnchorEl(null);
    setLevelAnchorEl(null)
  }

  const locationOpen = Boolean(locationAnchorEl);
  const levelOpen = Boolean(levelAnchorEl)
  const locationID = locationOpen ? 'simple-popover' : undefined;
  const levelID = levelOpen ? 'simple-popover' : undefined;

  return <div>
    <List sx={{display:"flex", flexDirection:"row"}}>

      {/* Location button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              px: 0,
              display:"flex", flexDirection:"row"
            }} onClick={showLocation}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <LocationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Location" />
        </ListItemButton>
      </ListItem>

      {/* Table sensor button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              px: 0,
            }} onClick={()=>navigate('/editTable')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <SensorsIcon />
          </ListItemIcon>
          <ListItemText primary="Table Sensor"  />
        </ListItemButton>
      </ListItem>

      {/* Floor plan button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              px: 0,
            }} onClick={()=>navigate('/editFloorPlan')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Floor Plan" />
        </ListItemButton>
      </ListItem>
      
      <ListItem disablePadding>
        <ListItemButton sx={{
              px: 0,
            }} onClick={()=>navigate('/')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Log In" />
        </ListItemButton>
      </ListItem>
    </List>

    <Popover
      id={locationID}
      open={locationOpen}
      anchorEl={locationAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {locations.map((item,index)=>{
        return <MenuItem key={index} onClick={event=>showLevel(event,item.location, item.id)}>{item.location}</MenuItem>
      })}
    </Popover>

    <Popover
      id={levelID}
      open={levelOpen}
      anchorEl={levelAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {levels.map((item,index)=>{
        return <MenuItem key={index} onClick = {()=>URLredirect(item.level)}>{item.level}</MenuItem>
      })}
    </Popover>
  </div>
} 

export default ListOfNavButtons