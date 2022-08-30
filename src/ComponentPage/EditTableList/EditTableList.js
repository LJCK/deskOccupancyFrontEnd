import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import ShowAllTables from './ShowAllTables';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'

export const EditTableList = () => {
  
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const config = isMatch? "column":"row"
  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)
  
  return (
    <div style={{paddingLeft:"1rem"}}>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        <Grid item xs={11}>
          <DropDownInput locationState={locations} levelState={levels} config={config}/>
        </Grid>
        <Grid item xs={12}>
          <h1>Existing Tables</h1>
        </Grid>
        <Grid item xs={12}>
          <ShowAllTables/>
        </Grid>
      </Grid>
    </div>
  )
}
