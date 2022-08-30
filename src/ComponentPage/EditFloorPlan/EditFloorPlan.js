import React, {useState} from 'react'
import Grid from '@mui/material/Grid';
import UploadFloorPlan from './UploadFloorPlan';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'
import ShowAllFloorPlans from './ShowAllFloorPlans';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

export const EditFloorPlan = () => {

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const config = isMatch? "column":"row"

  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)

  return (
    <div style={{paddingLeft:"1rem"}}>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <h1>Upload Floor Plan</h1>
        </Grid>
        
        <Grid item xs={11}>
          <UploadFloorPlan locationState={locations} levelState={levels} config={config}/>
        </Grid>
        <Grid item xs={12}>
          <h1>Existing Floor Plans</h1>
        </Grid>
        <Grid item xs={12}>
          <ShowAllFloorPlans/>
        </Grid>
      </Grid>
    </div>
  )
}
