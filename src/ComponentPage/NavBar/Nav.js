import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Buttons from './Buttons';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'
import axios from 'axios'

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      mode:'dark',
      black: {
        main: '#1976d2',
      }
    },
  });

export const Nav = () => {

  let navigate = useNavigate();

  const [locations, setLocations] = useState(allLocations)
  const [levels, setLevels] = useState([])
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [levelAnchorEl, setLevelAnchorEl] = useState(null);

  const showLocation = (e) => {
    setLocationAnchorEl(e.currentTarget);
    // axios.get("http://localhost:3001/desk/getLevels?location=${}").then((res)=>setLevels(res.data))
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

  return (
    <div >
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color='black'>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick = {showLocation}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={()=>navigate('/')}>
                Desk Occupancy Checker
              </Typography>
              <Buttons/>
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
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
          vertical: 'bottom',
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
  )
}
