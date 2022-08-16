import DisplayTableStatus from "./ComponentPage/DisplayTableStatus/DisplayTableStatus";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from "./ComponentPage/Home";
import { SideBar } from "./ComponentPage/NavBar/SideBar";
import {EditTableList} from "./ComponentPage/EditTableList/EditTableList"
import {EditFloorPlan} from "./ComponentPage/EditFloorPlan/EditFloorPlan"

function App() {
  return (
    <div style={{"marginLeft" : "5rem"}}>
      <Router>
        <SideBar/>
        <Routes>
          <Route exact path='/' element = {<Home/>}></Route>
          <Route path='/level/:id' element = {<DisplayTableStatus/>}></Route>
          <Route path='/editTable' element = {<EditTableList/>}></Route>
          <Route path = '/editFloorPlan' element = {<EditFloorPlan/>}></Route>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
