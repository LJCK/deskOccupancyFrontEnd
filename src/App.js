import DisplayTableStatus from "./ComponentPage/DisplayTableStatus/DisplayTableStatus";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { green } from '@mui/material/colors';
import { Home } from "./ComponentPage/Home";
import { TopBar } from "./ComponentPage/NavBar/TopBar";
import {EditTableList} from "./ComponentPage/EditTableList/EditTableList"
import {EditFloorPlan} from "./ComponentPage/EditFloorPlan/EditFloorPlan"
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: green[500],
      }
    },
  });
  
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme = {theme}>
        <CssBaseline/>
        <Router >
          <TopBar/>
          <Routes>
              <Route exact path='/' element = {<Home />}></Route>
              <Route path='/:id' element = {<DisplayTableStatus/>}></Route>
              <Route path='/editTable' element = {<EditTableList/>}></Route>
              <Route path = '/editFloorPlan' element = {<EditFloorPlan/>}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
