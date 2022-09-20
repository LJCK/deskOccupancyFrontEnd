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
import {useSnackbar} from "notistack"
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';

const ShowAllFloorPlans = ({rerender, setRerender}) => {

  const { enqueueSnackbar } = useSnackbar();
  const [allImages, setAllImages] = useState([])
  const {user} = useAuthContext()
  const { logout } = useLogout()

  const handleDelete=(e, id)=>{
    e.preventDefault()
    const payload = {id: id}
    if(user) {
      axios.delete(`${process.env.REACT_APP_API_URL}/floorPlan/deleteImage`, {headers: {"Authorization" : `Bearer ${user.token}`}, data : payload}).then((res)=>{
      console.log("res is ", res.data)
      setRerender(!rerender)
    }).catch((error)=>{
      if(error.response.data.error === "Your login session has expired."){
        customAlert(error.response.data.error, "error")
        logout()
      }else{
        customAlert(error.response.data, "error")
      }
    })
    }
    
  }

  useEffect(()=>{
    if(user) {
      axios.get(`${process.env.REACT_APP_API_URL}/floorPlan/getAllImages`, { headers: {"Authorization" : `Bearer ${user.token}`}}).then((res)=>{ 
    setAllImages(res.data)
    }).catch((error)=>{
      if(error.response.data.error === "Your login session has expired."){
        customAlert(error.response.data.error, "error")
        logout()
      }else{
        customAlert(error.response.data, "error")
      }
    })
    }
    
  },[rerender])

  const customAlert=(message,variant)=>{
    enqueueSnackbar(message, {variant})
  }

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