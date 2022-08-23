import DisplayTableStatus from "./ComponentPage/DisplayTableStatus/DisplayTableStatus";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from "./ComponentPage/Home";
import { SideBar } from "./ComponentPage/NavBar/SideBar";
import {EditTableList} from "./ComponentPage/EditTableList/EditTableList"
import {EditFloorPlan} from "./ComponentPage/EditFloorPlan/EditFloorPlan"
import { useState } from "react";
import {OnOffContextProvider} from "./Context/OnOffContext"

function App() {
  
  return (
    // <div style={{"marginLeft" : "5rem"}}>
    <div>
      <Router>
        <OnOffContextProvider >
          <SideBar/>
          <Routes>
              <Route exact path='/' element = {<Home/>}></Route>
              <Route path='/:id' element = {<DisplayTableStatus/>}></Route>
              <Route path='/editTable' element = {<EditTableList/>}></Route>
              <Route path = '/editFloorPlan' element = {<EditFloorPlan/>}></Route>
          </Routes>
        </OnOffContextProvider>
      </Router>
      
    </div>
  );
}

export default App;
