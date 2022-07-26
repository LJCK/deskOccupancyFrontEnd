import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
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

  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [levelAnchorEl, setLevelAnchorEl] = useState(null);
  const locationOpen = Boolean(locationAnchorEl);
  const levelOpen = Boolean(levelAnchorEl);

  const [locations,setLocations] = useState(allLocations);
  const [levels, setLevels] = useState(allLevels)

  const showLocations = (e) => {
    setLocationAnchorEl(e.currentTarget);
    // axios.get("http://localhost:3001/desk/getLevels?location=${}").then((res)=>setLevels(res.data))
  };
  const showLevels =(e)=>{
    setLevelAnchorEl(e.currentTarget)
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
                onClick = {showLocations}
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
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={locationAnchorEl}
        open={locationOpen}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {Object.keys(locations).map((location,index)=>{
          return <MenuItem key={index} onClick = {showLevels}>{location}</MenuItem>
        })}
      </Menu>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={levelAnchorEl}
        open={levelOpen}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {Object.keys(levels).map((level,index)=>{
          return <MenuItem key={index} onClick = {()=>URLredirect(levels[level])}>{level}</MenuItem>
        })}
      </Menu>
    </div>
  )
}
