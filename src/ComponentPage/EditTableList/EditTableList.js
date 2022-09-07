import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import ShowAllTables from './ShowAllTables';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'


export const EditTableList = (mqttClient) => {

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const config = isMatch? "column":"row"
  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)
  const [rerender, setRerender] = useState(false)
  
  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        <Grid item xs={11}>
          <DropDownInput locationState={locations} levelState={levels} mqttClient={mqttClient} rerender={rerender} setRerender={setRerender} config={config}/>
        </Grid>
        <Grid item xs={11}>
          <h1>Existing Tables</h1>
        </Grid>
        <Grid item xs={11}>
          <ShowAllTables mqttClient={mqttClient} rerender={rerender} setRerender={setRerender}/>
        </Grid>
      </Grid>
    </div>
  )
}
