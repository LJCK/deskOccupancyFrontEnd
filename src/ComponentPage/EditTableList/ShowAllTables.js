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
  
  const removeDevice=(deskID)=>{
    // device is force removed, this works with aqara sensor, not sure about other brand
    mqttClient.publish("zigbee2mqtt/bridge/request/device/remove", `{ "id": "devices/${deskID}", "force":true}`)
  }

  const handleDelete=(e, locationID, deskID)=>{
    e.preventDefault()

    if(!user) {
      console.log("user not logged")
      return
    }

    const payload = {locationID:locationID,deskID:deskID}
    axios.delete("http://localhost:3001/desk/deleteDesk", {headers: {"Authorization" : `Bearer ${user.token}`}, data:payload}).then((res)=>{
      if(res.status === 200){
        removeDevice(payload.deskID)
        setRerender(!rerender)
      }
    }).catch((err)=>console.log(err))
  }

  useEffect(()=>{

    if (user){
      axios.get("http://localhost:3001/desk/getAllSensors", { headers: {"Authorization" : `Bearer ${user.token}`} }).then((res)=>{
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
          <TableCell align="right">Desk ID</TableCell>
          <TableCell align="right">Delete</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {allSensors.map((oneLevel)=>{
          return oneLevel.desks.map((oneDesk)=>{
            return <TableRow key={oneDesk['deskID']}>
              <TableCell>{oneLevel['location']}</TableCell>
              <TableCell align="right">{oneLevel['level']}</TableCell>
              <TableCell align="right">{oneDesk['deskID']}</TableCell>
              <TableCell align="right"><Button variant="contained" color="error" onClick={(e)=>handleDelete(e,oneLevel['_id'], oneDesk['deskID'])}>Delete</Button></TableCell>
            </TableRow>
          })
        })}
      </TableBody>
    </Table>
    </TableContainer>
  )
}

export default ShowAllTables