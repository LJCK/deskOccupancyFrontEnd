import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ListOfNavButtons from './ListOfNavButtons';
import Popover from '@mui/material/Popover';


const NavButtonMobile = () => {

  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ID = open ? 'simple-popover' : undefined;
  

  return (
    <div>
      <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
      </IconButton>

      <Popover
        id="ID"
        open={open}
        anchorEl={anchorEl}
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
        <ListOfNavButtons config={{display:"flex", flexDirection:"column"}}/>
      </Popover>

    </div>
  )
}

export default NavButtonMobile