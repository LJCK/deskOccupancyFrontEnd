import React from 'react'

export const FloorPlanDisplay = (data) => {
  console.log(data)
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(data.img.data.data))
  );
  return (
    <img src={`data:image/png;base64,${base64String}`} width="300"/>
  )
}
