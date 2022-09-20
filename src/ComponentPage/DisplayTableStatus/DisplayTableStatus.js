import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/Image';
import SpeedDial from '@mui/material/SpeedDial';
import { lightBlue } from '@mui/material/colors';
import axios from 'axios'
import Typography from '@mui/material/Typography';
import { Box } from "@mui/material";
import Modal from '@mui/material/Modal';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const floorPlanStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center'
};

const DisplayTableStatus=({mqttClient})=>{
  const [tableStatus,setTableStatus] = useState([])
  const [numerator, setNumerator] = useState()
  const [denominator, setDenominator] = useState()
  const [floorPlan,setFloorPlan] = useState([])
  const [open, setOpen] = useState(false)
  const [displayGroup, setDisplayGroup] = useState(0)

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const { id } = useParams()

  // useEffect(()=>{
  //   axios.get(`http://localhost:3001/floorPlan/getImage?filename=${id}_floor_plan`).then((res)=>{
  //     if (res.data[0] === null){
  //       setFloorPlan([])
  //     }else{
  //       setFloorPlan(res.data)
  //     }
  //   })
  // },[])

  useEffect(()=>{
    mqttClient.on('message', messageCallBack)
    function messageCallBack (topic,message){
      if(topic === `bumGoWhere/frontend/update/${id}`){
        const payload = JSON.parse(message)
        

      }
    }

    axios.get(`http://localhost:3001/floorPlan/getImage?filename=${id}_floor_plan`).then((res)=>{
      if (res.data[0] === null){
        setFloorPlan([])
      }else{
        setFloorPlan(res.data)
      }
    })

    axios.get(`http://localhost:3001/sensor/getSensorStatus?level=${id}`).then((res)=>{
      const sensors = res.data.sensors
      setNumerator(sensors.occupiedSensors) 
      setDenominator(sensors.numOfVibrationSensors)

      if(sensors.sensors){
        const arr = sensors.sensors 
        const vibrationSensors = arr.filter(item => item.sensorType === "vibration") 
        vibrationSensors.sort(function(a,b){return a.sensorID.localeCompare(b.sensorID, undefined, {numeric:1})}) 
        const arrSeparationLoop = Math.ceil(vibrationSensors.length/10)  
        const newArr = [] 
        for(let i=0; i<arrSeparationLoop; i++){ 
          let partArr = vibrationSensors.slice(i*10, i*10+10) 
          // console.log(partArr) 
          newArr.push(partArr) 
        } 
        console.log(newArr) 
        setTableStatus(newArr)
      } 
    }).catch((error)=>{ console.log(error)})
  },[id])

  return (
    <div>
      <Grid  container spacing={{ xs: 6}}  justifyContent={"center"} paddingTop={"15px"}>
        
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Typography variant="h4" color={lightBlue[900]}> Welcome to <u>Level {id.split("_").at(-1)}!</u></Typography >
        </Grid>

        {/* grid for showing occupancy rate */}
        <Grid item xs={12} md={6} display={"flex"} justifyContent={"center"}>
          
          <Paper sx={{borderRadius: 100, border:"5px solid", borderColor: lightBlue[900], height : 200, width :200, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Typography variant="h5" display ={"flex"} flexDirection={"column"} justifyContent={"center"} textAlign={"center"}>
            <Box component='span' sx={{"fontSize": "200%"}}>{denominator - numerator}</Box> out of {denominator} tables available</Typography>
          </Paper>

        </Grid>

        {/* grid for buttons and table icons */}
        <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
          
          <Grid item xs={12} display={"flex"} justifyContent={"center"} maxHeight={"30px"} marginBottom={"20px"}>
            {tableStatus.map((item, index)=>{
              return <Button variant="outlined" key={index} onClick={()=>setDisplayGroup(index)}>{item[0]["sensorID"].split("_").at(-1)} - {item.at(-1)["sensorID"].split("_").at(-1)}</Button>
            })}
          </Grid>

          <Grid container spacing={2} columns={{xs:5}} direction="row" justifyContent="space-around" alignItems="center"> 
            {tableStatus.map((item,index)=>{
              if(index !== displayGroup){
                return
              }
              return item.map((i, index)=>{
                return <Grid item xs={1} key={index} display={"flex"} justifyContent={"center"}>
                  <Paper sx={{bgcolor : i["status"] ==="unoccupied" || i["status"] === null? "#C1F4B8" : "#FFA5A5", height: 60, width:40}} >
                    Table <Box component={"span"} display={"flex"} justifyContent={"center"}>{i["sensorID"].split("_").at(-1)}</Box>
                  </Paper>
                </Grid>
              })
            })}
          </Grid>
        </Grid>
        
      </Grid>
      
      {isMatch ? <Box border={"solid"} marginTop={"5px"}>
        {floorPlan.map((singleData, index) => {
          const base64String = btoa(new Uint8Array(singleData.img.data.data).reduce(
            function (data, byte) {
                return data + String.fromCharCode(byte);
            },
            ''
        ));
          return <img src={`data:image/png ;base64,${base64String}`} width="100%" key={index}/>
        })}
        <h3 style={{"textAlign": "center"}}>Floor Plan</h3>
        </Box> 
        : 
        <Box>
          {/* pop up image */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            { 
              floorPlan[0] === undefined? 
              <Box sx={floorPlanStyle}>   <ImageNotSupportedIcon/>    <h3 style={{"textAlign": "center"}}>Floor Plan Not Exist</h3>
            </Box> : <Box sx={floorPlanStyle}>

              {floorPlan.map((singleData, index) => {
                const base64String = btoa(new Uint8Array(singleData.img.data.data).reduce(
                  function (data, byte) {
                      return data + String.fromCharCode(byte);
                  },
                  ''
              ));
                return <img src={`data:image/png ;base64,${base64String}`} width="100%" key={index}/>
              })}
              <h3 style={{"textAlign": "center"}}>Floor Plan</h3>
            </Box>
            }
            
          </Modal>

          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<ImageIcon />}
            onClick = {handleOpen}
          >
          </SpeedDial>
        </Box>
      } 
      
    </div>
  )
}

export default DisplayTableStatus