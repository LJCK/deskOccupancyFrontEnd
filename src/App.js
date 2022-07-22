import DisplayTableStatus from "./ComponentPage/DisplayTableStatus/DisplayTableStatus";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from "./ComponentPage/Home";
import { Nav } from "./ComponentPage/NavBar/Nav";
import {EditTableList} from "./ComponentPage/EditTableList/EditTableList"

function App() {
  return (
    <div>
      <Router>
        <Nav/>
        <Routes>
          <Route exact path='/' element = {<Home/>}></Route>
          <Route path='/level/:id' element = {<DisplayTableStatus/>}></Route>
          <Route path='/editTable' element = {<EditTableList/>}></Route>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
