import React, { useState } from "react";
import axios from 'axios'
import Button from '@mui/material/Button';

const Table=()=>{
  const [tableStatus, setTableStatus] = useState([])

  const handleSubmit = (e) =>{
    e.preventDefault()

    axios.get("http://localhost:3001/table/67",tableStatus).then((res)=>{setTableStatus(res.data)})
  }

  return (
    <>
      <Button variant="contained" onClick={handleSubmit}>table 1</Button>
      <h3>{tableStatus}</h3>
    </>
  )
}

export default Table