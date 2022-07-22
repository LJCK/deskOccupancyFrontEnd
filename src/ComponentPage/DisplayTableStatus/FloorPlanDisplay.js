import React,{useState} from 'react'

export const FloorPlanDisplay = (data) => {
  const [floorPlan,setFloorPlan] = useState([])
  const handleFloorPlan=(data)=>{
    setFloorPlan(data)
  }
  console.log(data)
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(data.data.img.data.data))
  );
  return (
    <img src={`data:image/png;base64,${base64String}`} width="300" alt='floorPlan'/>
  )
}
