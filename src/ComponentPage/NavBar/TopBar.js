import React, { useContext, useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import AuthButtons from './AuthButtons'
import { useNavigate } from 'react-router-dom';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useCustemContext } from '../../Context/OnOffContext';


export const TopBar = () => {
  let navigate = useNavigate();
  const {isSideBarOpen,setIsSideBarOpen} = useCustemContext()
  

  return (
    <div>
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={isSideBarOpen} >
        <Toolbar>
          
          <a href="/"><AirlineSeatReclineNormalIcon style={{"marginLeft":"-1.5rem"}} fontSize="large"/></a>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bum Go Where
          </Typography>
        </Toolbar>
      </AppBar>
      
    </Box>
    </div>
  );
}
