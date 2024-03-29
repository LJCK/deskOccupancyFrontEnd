import DisplayTableStatus from "./ComponentPage/DisplayTableStatus/DisplayTableStatus";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { green } from '@mui/material/colors';
import { Home } from "./ComponentPage/Home";
import { TopBar } from "./ComponentPage/NavBar/TopBar";
import {EditTableList} from "./ComponentPage/EditTableList/EditTableList"
import {EditFloorPlan} from "./ComponentPage/EditFloorPlan/EditFloorPlan"
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import Login from './ComponentPage/Login/Login'
import Signup from './ComponentPage/Login/Signup'
import { useAuthContext } from "./hooks/useAuthContext";


const AWS = require("aws-sdk");
const AWSIoTData = require('aws-iot-device-sdk');

let awsConfig = {
  identityPoolId: "ap-southeast-1:f187afe2-9cd1-4678-9dc2-9ab7d0b98589",
  mqttEndpoint: "a2x864rhawhdg9-ats.iot.ap-southeast-1.amazonaws.com",
  region: "ap-southeast-1",
  clientId: "5ais045mjjoctk8vcmknkpq85t",
  userPoolId: "ap-southeast-1_PXBqmAstk"
};

const mqttClient = AWSIoTData.device({
  region: awsConfig.region,
  host: awsConfig.mqttEndpoint,
  clientId: awsConfig.clientId,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: '',
  secretKey: '',
  sessionToken: ''
});

AWS.config.region = awsConfig.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: awsConfig.identityPoolId
});

AWS.config.credentials.get((err) => {
  if (err) {
      console.log(AWS.config.credentials);
      throw err;
  } else {
      mqttClient.updateWebSocketCredentials(
          AWS.config.credentials.accessKeyId,
          AWS.config.credentials.secretAccessKey,
          AWS.config.credentials.sessionToken
      );
  }
});

mqttClient.on('connect', () => {
  console.log('mqttClient connected')
  mqttClient.subscribe('zigbee2mqtt/bridge/event')
  mqttClient.subscribe('bumGoWhere/frontend/update/#')
  console.log("subscribed to zigbee2mqtt/bridge/event and bumGoWhere/frontend/update/#")
  // mqttClient.on("message", messageCallBack)
});

// function messageCallBack (topic,message){
//   if(topic === "bumGoWhere/frontend/update"){
//     tableObjs = JSON.parse(message)
//     console.log(tableObjs)
//   }
// }

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: green[500],
      }
    },
  });

  const {user} = useAuthContext()
  
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme = {theme}>
        <CssBaseline/>
        <Router >
          <TopBar mqttClient={mqttClient}/>
          <Routes>
              <Route exact path='/' element = {<Home />}></Route>
              <Route path='/:id' element = {<DisplayTableStatus mqttClient={mqttClient}/>}></Route>
              <Route path='/editTable' element = {user ? <EditTableList mqttClient={mqttClient}/> : <Home />}></Route>
              <Route path = '/editFloorPlan' element = {user ? <EditFloorPlan/> : <Home />}></Route>
              <Route path='/login' element={!user ? <Login/> : <Home />}></Route>
              <Route path='/signup' element={!user ? <Signup/> : <Home />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
