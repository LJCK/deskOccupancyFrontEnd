import React, {useEffect} from 'react'
import {useLocation} from "react-router-dom"
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListOfNavButtons from './ListOfNavButtons'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import NavButtonMobile from './NavButtonMobile';

export const TopBar = ({mqttClient}) => {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()

  useEffect(()=>{
    console.log("URL changed")
    mqttClient.removeAllListeners('message')
    console.log("removed all listeners")
  }, [location])
  return (
    <Box >
      <AppBar position="static" >
        
        <Toolbar>
          <a href="/"><AirlineSeatReclineNormalIcon fontSize="large"/></a>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bum Go Where
          </Typography>
          {isMatch ? <NavButtonMobile/>:<ListOfNavButtons config={{display:"flex", flexDirection:"row"}} />}
          
        </Toolbar>
      </AppBar>
      
    </Box>
  );
}
