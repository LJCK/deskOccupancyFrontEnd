
import React, { useEffect, useState } from 'react'
import axios from 'axios'


export const Home = () => {

  const {text, setText} = useState([])

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/getFile?filename=text.txt`).then((res)=>{
      console.log(res.data)
    })
  },[])

  return (
    <div style={{paddingLeft:"1rem",paddingRight:"1rem"}}>
      <h1>Home Page</h1>
    </div>
  )
}
