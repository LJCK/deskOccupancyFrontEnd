import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react'
import { useCustemContext } from '../../Context/OnOffContext';

export const DrawerHeader =({children})=>{
  const initialPadding = 9
  const paddingAfterSideOpen = 26
  const {isSideBarOpen, setIsSideBarOpen} = useCustemContext()
  const [contentPadding, setContentPadding] = useState(initialPadding)
  console.log("on home component: open: ", isSideBarOpen)

  const Header = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0,0,0, contentPadding),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  useEffect(()=>{
    if(isSideBarOpen){
      setContentPadding(paddingAfterSideOpen)
    } else{
      setContentPadding(initialPadding)
    }
  },[isSideBarOpen])

  return(
    <Header>
      {children}
    </Header>
  )
}
