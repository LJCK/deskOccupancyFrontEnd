import React,{useState} from 'react'
import Grid from '@mui/material/Grid';
import DropDownInput from './DropDownInput';
import ShowAllTables from './ShowAllTables';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import allLocations from '../../Constants/locations.json'
import allLevels from '../../Constants/levels.json'

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
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

export const EditTableList = () => {

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('md'))
  const config = isMatch? "column":"row"
  const [locations,setLocations]= useState(allLocations)
  const [levels,setLevels] = useState(allLevels)
  const [rerender, setRerender] = useState(false)
  
  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={11}>
          <h1>Add Table</h1>
        </Grid>
        <Grid item xs={11}>
          <DropDownInput locationState={locations} levelState={levels} mqttClient={mqttClient} rerender={rerender} setRerender={setRerender} config={config}/>
        </Grid>
        <Grid item xs={11}>
          <h1>Existing Tables</h1>
        </Grid>
        <Grid item xs={11}>
          <ShowAllTables mqttClient={mqttClient} rerender={rerender} setRerender={setRerender}/>
        </Grid>
      </Grid>
    </div>
  )
}
