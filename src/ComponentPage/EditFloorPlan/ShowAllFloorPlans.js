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

const ShowAllFloorPlans = ({rerender, setRerender}) => {
  const [allImages, setAllImages] = useState([])

  const handleDelete=(e, id)=>{
    e.preventDefault()
    const payload = {id: id}
    axios.delete("http://localhost:3001/floorPlan/deleteImage", {data : payload}).then((res)=>{
      console.log("res is ", res.data)
      setRerender(!rerender)
    }).catch((error)=>{
      console.log(error)
    })
  }

  useEffect(()=>{
    axios.get("http://localhost:3001/floorPlan/getAllImages").then((res)=>{ 
    setAllImages(res.data)
    })
  },[rerender])
  return (
    <TableContainer component={Paper} >
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Location</TableCell>
          <TableCell align="right">Level</TableCell>
          <TableCell align="right">Delete</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {allImages.map((oneImage)=>{
          return <TableRow key={oneImage["_id"]}>
              <TableCell>{oneImage['location']}</TableCell>
              <TableCell align="right">{oneImage['level']}</TableCell>
              <TableCell align="right"><Button variant="contained" color="error" onClick={(e)=>handleDelete(e,oneImage['_id'])}>Delete</Button></TableCell>
            </TableRow>
          })
        }
      </TableBody>
    </Table>
    </TableContainer>
  )
}

export default ShowAllFloorPlans