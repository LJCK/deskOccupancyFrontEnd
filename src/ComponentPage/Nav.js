import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [allLevels,setAllLevel] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    axios.get("http://localhost:3001/getAllLevels").then((res)=>setAllLevel(res.data))
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeURL =(level)=>{
    navigate(`/level/${level}`);
    setAnchorEl(null);
  }

  return (
    <div>
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
                onClick = {handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={()=>navigate('/')}>
                Desk Occupancy Checker
              </Typography>
              <Box sx={{
                display: 'flex',
                '& > *': {m: 1,},
              }}>
                <Button sx={{ml:1}} variant="contained" component="label" style={{'color':'black','backgroundColor':'white'}} onClick={()=>navigate('/editTable')}>
                  Edit Table
                </Button>
                <Button sx={{ml:1}} variant="contained" component="label" style={{'color':'black','backgroundColor':'white'}} onClick={()=>navigate('/')}>
                  Log Out
                </Button>
                <Button sx={{ml:1}} variant="contained" component="label" style={{'color':'black','backgroundColor':'white'}} onClick={()=>navigate('/')}>
                  Log In
                </Button>
              </Box>
              
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {allLevels.map((item,index)=>{
          return <MenuItem key={index} onClick={()=>changeURL(item)}>{`Level ${item}`}</MenuItem>
        })}
        {/* <MenuItem onClick={handleClose}>profile</MenuItem> */}
      </Menu>
    </div>
  )
}
