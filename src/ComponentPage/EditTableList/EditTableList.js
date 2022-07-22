import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import { ShowAllTables } from './ShowAllTables';

export const EditTableList = () => {
  
  const [locations,setLocations]= useState({"Novena Tower A":'nva', "Novena Tower B":"nvb"})
  const [levels,setLevels] = useState({"Level 1":'l1', "Level 2":'l2', "Level 3":'l3', "Level 4":'l4', "Level 5":'l5', "Level 6":'l6', "Level 7":'l7', "Level 8":'l8', "Level 9":'l9'})
  
  const handleUpdate=(e)=>{
    e.preventDefault()
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        {/* <Grid item xs={1} sx={{mt:3}}>
          <SettingsIcon style={{position:"fixed", right:"1%"}}/>
        </Grid> */}
        <Grid item xs={12}>
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
