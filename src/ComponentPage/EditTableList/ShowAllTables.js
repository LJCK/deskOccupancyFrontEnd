import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';


const ShowAllTables = ({mqttClient, rerender, setRerender}) => {
  const [allSensors, setAllSensors] = useState([])
  const {user} = useAuthContext()
  
  const removeDevice=(sensorID)=>{
    // device is force removed, this works with aqara sensor, not sure about other brand
    mqttClient.publish("zigbee2mqtt/bridge/request/device/remove", `{ "id": "devices/${sensorID}", "force":true}`)
    // mqttClient.subscribe("zigbee2mqtt/bridge/request/device/remove")
    // mqttClient.on("message", function(topic, message){
    //   if (topic =="zigbee2mqtt/bridge/request/device/remove"){
    //     console.log("remove success, message: ", JSON.parse(message))
    //   }
    // })
  }

  const handleDelete=(e, locationID, sensorID)=>{
    e.preventDefault()

    if(!user) {
      console.log("user not logged")
      return
    }

    const payload = {locationID:locationID,sensorID:sensorID}
    axios.delete("http://localhost:3001/sensor/deleteSensor", {headers: {"Authorization" : `Bearer ${user.token}`}, data:payload}).then((res)=>{
      if(res.status === 200){
        removeDevice(payload.sensorID)
        setRerender(!rerender)
      }
    }).catch((err)=>console.log(err))
  }

  useEffect(()=>{

    if (user){
      axios.get("http://localhost:3001/sensor/getAllSensors", { headers: {"Authorization" : `Bearer ${user.token}`} }).then((res)=>{
      const arr = res.data[0].sensors
      arr.sort(function(a,b){return a.sensorID.localeCompare(b.sensorID, undefined, {numeric:1})})
      setAllSensors(res.data)
    })
    }
    
  },[rerender, user])

  return (
    <TableContainer component={Paper} >
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Location</TableCell>
          <TableCell align="right">Level</TableCell>
          <TableCell align="right">Sensor ID</TableCell>
          <TableCell align="right">Delete</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {allSensors.map((oneLevel)=>{

          return oneLevel["sensors"].map((oneSensor,index)=>{
            return <TableRow key={index}>
              <TableCell>{oneLevel['location']}</TableCell>
              <TableCell align="right">{oneLevel['level']}</TableCell>
              <TableCell align="right">{oneSensor["sensorID"]}</TableCell>
              <TableCell align="right"><Button variant="contained" color="error" onClick={(e)=>handleDelete(e,oneLevel['_id'], oneSensor["sensorID"])}>Delete</Button></TableCell>
            </TableRow>
          })
        })}
      </TableBody>
    </Table>
    </TableContainer>
  )
}

export default ShowAllTables