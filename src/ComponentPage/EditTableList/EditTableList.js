import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import ShowAllTables from './ShowAllTables';

import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'

export const EditTableList = () => {
  
  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)
  
  const handleUpdate=(e)=>{
    e.preventDefault()
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        <Grid item xs={11}>
          <DropDownInput locationState={locations} levelState={levels}/>
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
