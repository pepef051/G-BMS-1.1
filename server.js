require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;
const Dbschema = require('./DBschema/DBschema');
const project_1_0 = require('./routes/project-1.0');
//const multitask = require('./routes/multitask');
var server = app.listen(port, listening);
var ip = require('ip');
var ipVar = ip.address();
 

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USER, // use environment variable
      pass: process.env.EMAIL_PASSWORD // use environment variable
    }
  });


  
  
  app.use(express.urlencoded({ extended: false}));
  app.use(express.json());
  app.use('/project_1_0', project_1_0)
  app.use(express.static('landing'));
  app.all('*', (req, res) => {res.status(404).send('<h1>404! Wrong Route, Sorry </h1>');}); 
  
  //TIMING
  const checkHour = 8;
  const checkMinit = 10;
  const intervalTime = 5000;
  var date;
  var isoDateTime;
  var hour;
  var min;
  var checkDone = false;
  

      
  //FUNCTIONS
  const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  
  function listening() {
      console.log(`Server Live at ${ipVar}:${port}`);
      //assetsReading();
  }

  function dateTime(){
      date = new Date();
      isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
      return isoDateTime;
  }





  const connectDB = async () => {
      try {
          mongoose.set('strictQuery', false);
          mongoose.connect(process.env.MONGODB_URI);
          dateTime(); 
          console.log(`Connected to database at ${isoDateTime}`)
      } catch(error) {
          console.log(error);
          process.exit();
      }      
  }
  

  async function scheduledFunction(){
    date = new Date();
    isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    hour = date.getHours(); 
    min = date.getMinutes();
    
    
    if (hour === checkHour && min === checkMinit && checkDone === false) {
    console.log("its time to Run the code");
    assetsReading();
    checkDone = true;
    }
    if (min != checkMinit) {
        if(min != checkMinit && checkDone === true){

        }
    checkDone = false; // this is to reset the condition to call on schedule once
    }
}


    connectDB();

    //setInterval(scheduledFunction, intervalTime);