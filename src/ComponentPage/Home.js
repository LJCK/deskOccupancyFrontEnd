
import React from 'react'


export const Home = () => {
  console.log("this is home, api url is ", process.env.REACT_APP_API_URL)
  return (
    <div style={{paddingLeft:"1rem",paddingRight:"1rem"}}>
      <h1>Home Page</h1>
    </div>
  )
}
