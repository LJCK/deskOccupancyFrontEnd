import Table from "./ComponentPage/Table";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from "./ComponentPage/Home";
import { Nav } from "./ComponentPage/Nav";
import {EditTable} from "./ComponentPage/EditTable"

function App() {
  return (
    <div>
      <Router>
        <Nav/>
        <Routes>
          <Route exact path='/' element = {<Home/>}></Route>
          <Route path='/level/:id' element = {<Table/>}></Route>
          <Route path='/editTable' element = {<EditTable/>}></Route>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
