import React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const Buttons = () => {

  let navigate = useNavigate();
  
  return (
    <div>
      <Box display='flex'>
        <Button sx={{ml:1}} variant="contained" component="label" style={{'color':'black','backgroundColor':'white'}} onClick={()=>navigate('/')}>
          Log Out
        </Button>
        <Button sx={{ml:1}} variant="contained" component="label" style={{'color':'black','backgroundColor':'white'}} onClick={()=>navigate('/')}>
          Log In
        </Button>
      </Box>
    </div>
  )
}

export default Buttons