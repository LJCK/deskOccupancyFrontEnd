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
import React,{useState} from 'react'
import axios from 'axios'


const ListOfNavButtons =({open})=>{

  let navigate = useNavigate();

  const [locations, setLocations] = useState(allLocations)
  const [levels, setLevels] = useState([])
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [levelAnchorEl, setLevelAnchorEl] = useState(null);

  const showLocation = (e) => {
    setLocationAnchorEl(e.currentTarget);
  };

  const showLevel = (event,location) => {
    setLevelAnchorEl(event.currentTarget)

    axios.get(`http://localhost:3001/desk/getAllLevels?location=${location}`).then((res)=>{setLevels(res.data)})
  }

  const handleClose = () => {
    setLocationAnchorEl(null);
    setLevelAnchorEl(null)
  };

  const URLredirect =(level)=>{
    navigate(`/level/${level}`);
    setLocationAnchorEl(null);
    setLevelAnchorEl(null)
  }

  const locationOpen = Boolean(locationAnchorEl);
  const levelOpen = Boolean(levelAnchorEl)
  const locationID = locationOpen ? 'simple-popover' : undefined;
  const levelID = levelOpen ? 'simple-popover' : undefined;

  return <div>
    <List>

      {/* Location button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }} onClick={showLocation}>
          <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}>
            <LocationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Location" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>

      {/* Table sensor button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }} onClick={()=>navigate('/editTable')}>
          <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}>
            <SensorsIcon />
          </ListItemIcon>
          <ListItemText primary="Table Sensor" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>

      {/* Floor plan button */}
      <ListItem disablePadding>
        <ListItemButton sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }} onClick={()=>navigate('/editFloorPlan')}>
          <ListItemIcon sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Floor Plan" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
        
      </ListItem>

    </List>

    <Popover
      id={locationID}
      open={locationOpen}
      anchorEl={locationAnchorEl}
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
      {locations.map((item,index)=>{
        return <MenuItem key={index} onClick={event=>showLevel(event,item.location)}>{item.location}</MenuItem>
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