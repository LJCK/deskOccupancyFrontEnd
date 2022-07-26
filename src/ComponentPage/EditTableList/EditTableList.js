import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import ShowAllTables from './ShowAllTables';
import UploadFloorPlan from './UploadFloorPlan';

export const EditTableList = () => {
  
  const [locations,setLocations]= useState({"Novena Tower A":'nva', "Novena Tower B":"nvb"})
  const [levels,setLevels] = useState({"Level 1":'1', "Level 2":'2', "Level 3":'3', "Level 4":'4', "Level 5":'5', "Level 6":'6', "Level 7":'7', "Level 8":'8', "Level 9":'9',"Level 10":'10',"Level 11":'11', "Level 12":'12', "Level 13":'13', "Level 14":'14', "Level 15":'15', "Level 16":'16', "Level 17":'17', "Level 18":'18', "Level 19":'19',"Level 20":'20',"Level 21":'21', "Level 22":'22', "Level 23":'23', "Level 24":'24', "Level 25":'25', "Level 26":'26', "Level 27":'27', "Level 28":'28', "Level 29":'29'})
  
  const handleUpdate=(e)=>{
    e.preventDefault()
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        <Grid item xs={12}>
          <DropDownInput locationState={locations} levelState={levels}/>
        </Grid>

        <Grid item xs={11}>
          <h1>Upload Floor Plan</h1>
        </Grid>
        <Grid item xs={12}>
          <UploadFloorPlan locationState={locations} levelState={levels} />
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
