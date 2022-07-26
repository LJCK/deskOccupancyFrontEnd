import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { style } from '@mui/system';

const ShowAllTables = ({locationState}) => {
  const [location, setLocation] = useState(locationState)

  const columns = [
    { field: 'location', headerName: 'Location', width: 130 },
    { field: 'level', headerName: 'Level', width: 130 },
    { field: 'id', headerName: 'ID', width: 130 },
  ];

  const rows = [
    { location: 'Novena Tower A', level: 'level8', id: 1},
    { location: 'Novena Tower A', level: 'level8', id: 2},
    { location: 'Novena Tower A', level: 'level8', id: 3},
    { location: 'Novena Tower A', level: 'level8', id: 4},
    { location: 'Novena Tower A', level: 'level8', id: 5},
    { location: 'Novena Tower A', level: 'level8', id: 6},
  ];

  useEffect(()=>{
    
  },[])
  return (
    <div style={{ height: 400, width:'30%', margin:"0 auto"}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  )
}

export default ShowAllTables