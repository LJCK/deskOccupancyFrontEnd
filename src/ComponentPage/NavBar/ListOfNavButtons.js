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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LogoutIcon from '@mui/icons-material/Logout';
import React,{useState} from 'react'
import axios from 'axios'
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const ListOfNavButtons =({config})=>{
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
    axios.get(`http://localhost:3001/sensor/getAllLevels?location=${location}`).then((res)=>{setLevels(res.data)})
  }

  const handleClose = () => {
    setLocationAnchorEl(null);
    setLevelAnchorEl(null);
  };

  const URLredirect =(level)=>{
    navigate(`/${url}_${level}`);
    setLocationAnchorEl(null);
    setLevelAnchorEl(null)
  }

  const { logout } = useLogout()

  const handleClick = () => {
    logout()
  }

  const { user } = useAuthContext()

  const locationOpen = Boolean(locationAnchorEl);
  const levelOpen = Boolean(levelAnchorEl)
  const locationID = locationOpen ? 'simple-popover' : undefined;
  const levelID = levelOpen ? 'simple-popover' : undefined;

  // const theme = useTheme();
  // const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  
  return <div>
    {!user && (
    <List sx={config} >

      {/* Location button */}
      <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={showLocation}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <LocationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Location" />
        </ListItemButton>
      </ListItem>

      <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={()=>navigate('/signup')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <PersonAddAlt1Icon />
          </ListItemIcon>
          <ListItemText primary="Signup"/>
        </ListItemButton>
      </ListItem>

      <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={()=>navigate('/login')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Log In" />
        </ListItemButton>
      </ListItem>
    </List>
    
  )}
    
    
    {user && (
    <List sx={config} >

    {/* Location button */}
    <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
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
      <ListItem  >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={()=>navigate('/editTable')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <SensorsIcon />
          </ListItemIcon>
          <ListItemText primary="Sensors"  />
        </ListItemButton>
      </ListItem>

      {/* Floor plan button */}
      <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={()=>navigate('/editFloorPlan')}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Plans" />
        </ListItemButton>
      </ListItem>

      {/* logout */}
      <ListItem >
        <ListItemButton sx={{
              px: 0,display:"flex",flexDirection:"column"
            }} onClick={handleClick}>
          <ListItemIcon sx={{
                justifyContent: 'center',
              }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </ListItem>
      
      <ListItem sx={{
            px: 0,display:"flex",flexDirection:"column"
          }} >
        <ListItemIcon sx={{
              justifyContent: 'center',
            }}>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={user.email} />
      </ListItem>
    </List>
    
    )}
    

    <Popover
      id={locationID}
      open={locationOpen}
      anchorEl={locationAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {Object.keys(locations).map((key,index)=>{
        return <MenuItem key={index} onClick={event=>showLevel(event,key,locations[key])}>{key}</MenuItem>
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