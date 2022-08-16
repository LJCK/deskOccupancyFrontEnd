import React, {useState} from 'react'
import Grid from '@mui/material/Grid';
import UploadFloorPlan from './UploadFloorPlan';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'

export const EditFloorPlan = () => {

  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)

  return (
    <div>
      <Grid container spacing={2}>
      <Grid item xs={11}>
          <h1>Upload Floor Plan</h1>
        </Grid>
        <Grid item xs={11}>
          <UploadFloorPlan locationState={locations} levelState={levels} />
        </Grid>
      </Grid>
    </div>
  )
}
