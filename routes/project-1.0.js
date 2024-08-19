require('dotenv').config();
const express = require('express');
const router = express.Router();
const Dbschema = require('../DBschema/DBschema');




var date;
var isoDateTime;
let reset;


function localdate(){
    date = new Date();
    isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
    
  }

        router.post('/monitoring', async (req, res) => {

          try{
            
            const serialNumber = {};
                  serialNumber.serialNumber = req.body.serialNumber;

                  const payload = {};
              //SERIAL NUMBER SEARCH
              const exists = await Dbschema.exists(serialNumber);
                
              if(!exists){
              throw new Error ('ERROR serialNumber NOT FOUND')
              } else {

                const query = await Dbschema.find(serialNumber);
                localdate();
                //filter just what BMS needs
                payload.apiMonitoringSyncTime = query[0].apiMonitoringSyncTime;
                payload.monitoring = query[0].monitoring;
                payload.date = isoDateTime;

                res.status(200).json(payload);
                
              }



          }
          catch(Error){
            console.error(`Error handling POST request at '/sync' : => ${Error}`);
            res.status(400).json({message: Error.message});
          }

        })

          //get all  
        router.get('/read', (req, resp) => {
            
            Dbschema.find({}).then((res) => {
              resp.send(res);
            }).catch((err) => {
                console.log("Error at  /read")
            });
          
          }); 


        //sync route, this route will assing ID and values once the BMS starts up
        router.post('/sync', async (req, res) => {

          try{
           var reset = false
            
            const serialNumber = {};
                  serialNumber.serialNumber = req.body.serialNumber;

                  const payload = {};
              //SERIAL NUMBER SEARCH
              const exists = await Dbschema.exists(serialNumber);
                
              if(!exists){
              throw new Error ('ERROR serialNumber NOT FOUND')
              } else {

                const query = await Dbschema.find(serialNumber);
                reset = query[0].reset;
          


                //filter and RESPONSE TO BMS 
                payload.reset = query[0].reset;
                payload.monitoring = query[0].monitoring;
                payload.auto = query[0].auto;
                payload.setPoint = query[0].setPoint;
                payload.apiSyncTime = query[0].apiSyncTime;
                payload.anagOutput0_10v_value = query[0].anagOutput0_10v.anagOutput0_10v_value;
                payload.stop = query[0].stop;

                res.status(200).json(payload);
                
              }

              if (reset == true){
               try{
                  
                  const options = { new: true };
                  await Dbschema.findOneAndUpdate( // HERE DOES NOT WORK
                    { serialNumber: req.body.serialNumber },
                    { $set: {"reset": false}},
                    options
                  );
                  console.log("Burner has been reseted and DB updated");
                } catch(err){console.log(err);}
                }

          }
          catch(Error){
            console.error(`Error handling POST request at '/sync' : => ${Error}`);
            res.status(400).json({message: Error.message});
          }
      
        })



        //user-general-update route, this route will write or update the user side values
        router.post('/user-general-update', async (req, res) => {
          try {
            localdate();
            const {
              serialNumber, Asset, location, link, anagOutput0_10v_name,
              output1_name, output2_name, output3_name, input1_name, input2_name,
              input3_name, input4_name, input5_name, input6_name, input7_name,
              input8_name, inputVS_name, inputVSS_name, anagInput0_10v_name,
              monitoring, auto, apiSyncTime, setPoint, anagOutput0_10v_value, reset, stop 
            } = req.body;
        
            const setItems = {};
            const pushItems = {};
         
        
            // Helper function for validation and setting values
            const validateAndSet = (parentKey, key, value, maxLength) => {

              if (value !== undefined) {

                //strings
                if (typeof value === 'string' && value.length <= maxLength) {
                  if (parentKey) {
                    setItems[parentKey] = setItems[parentKey] || {};
                    setItems[parentKey][key] = value;
                  } else {
                    setItems[key] = value;
                  }


                  //booleans
                } else if (typeof value === 'boolean') {
                  if (parentKey) {
                    setItems[parentKey] = setItems[parentKey] || {};
                    setItems[parentKey][key] = value;
                  } else {
                    setItems[key] = value;
                  }


                  //numbers
                }else if (typeof value === 'number') {
                    if (parentKey){
                      setItems[parentKey] = setItems[parentKey] || {};
                      setItems[parentKey][key] = value;
                    
                    } else {
                      setItems[key] = value;

                    }

                } else {
                  throw new Error(`The ${key} is not a valid string, boolean, or exceeds length ${maxLength}`);
                }
              }
            };
        
            // Validate and set simple properties
            validateAndSet(null, 'Asset', Asset, 40);
            validateAndSet(null, 'location', location, 40);
            validateAndSet(null, 'link', link, 100);

            //boolean
            validateAndSet(null, 'reset', reset);
            validateAndSet(null, 'stop', stop);
            validateAndSet(null, 'monitoring', monitoring);
            validateAndSet(null, 'auto', auto);
        
            // Validate and set nested properties
            validateAndSet('anagOutput0_10v', 'anagOutput0_10v_name', anagOutput0_10v_name, 40);
            validateAndSet('output1', 'output1_name', output1_name, 40);
            validateAndSet('output2', 'output2_name', output2_name, 40);
            validateAndSet('output3', 'output3_name', output3_name, 40);
            validateAndSet('input1', 'input1_name', input1_name, 40);
            validateAndSet('input2', 'input2_name', input2_name, 40);
            validateAndSet('input3', 'input3_name', input3_name, 40);
            validateAndSet('input4', 'input4_name', input4_name, 40);
            validateAndSet('input5', 'input5_name', input5_name, 40);
            validateAndSet('input6', 'input6_name', input6_name, 40);
            validateAndSet('input7', 'input7_name', input7_name, 40);
            validateAndSet('input8', 'input8_name', input8_name, 40);
            validateAndSet('inputVS', 'inputVS_name', inputVS_name, 40);
            validateAndSet('inputVSS', 'inputVSS_name', inputVSS_name, 40);
            validateAndSet('anagInput0_10v', 'anagInput0_10v_name', anagInput0_10v_name, 40);
            
            
            // Validate and set numbers
            validateAndSet(null, 'apiSyncTime', apiSyncTime);
            validateAndSet(null, 'setPoint', setPoint);
            validateAndSet('anagOutput0_10v', 'anagOutput0_10v_value', anagOutput0_10v_value);


            // Directly set boolean properties 
            //if (monitoring !== undefined) setItems['monitoring'] = monitoring;
           // if (auto !== undefined) setItems['auto'] = auto;

            // SERIAL NUMBER SEARCH
            const exists = await Dbschema.exists({ serialNumber });
        
            if (!exists) {
              throw new Error('ERROR serialNumber NOT FOUND');
            } else {

              const options = { new: true };
              if (Object.keys(setItems).length > 0 || Object.keys(pushItems).length > 0) {
                await Dbschema.findOneAndUpdate(
                  { serialNumber },
                  { $set: setItems},
                  options
                );
              }
              
      
              res.status(201).end();
            }
        
          } catch (err) {
            console.error(`Error handling POST request at '/user-general-update2': ${err}`);
            res.status(400).json({ message: err.message });
          }
        });



        //BMS-update just for bms updating values and states
        router.post('/BMS-update', async (req, res) => {
                  try {
                    localdate();
                    const { serialNumber, inputVS_value, inputVSS_value, anagInput0_10v_value,
                      output1_state, output2_state, output3_state, input1_state, input2_state, input3_state,
                      input4_state, input5_state, input6_state, input7_state, input8_state
                     } = req.body;
                
                    const pushItems = {};
                    const setItems = {};
                
                    if (inputVS_value !== undefined && typeof inputVS_value === 'number') {
                      try { 
                        // Prepare the items to be pushed into the arrays
                        pushItems['inputVS.inputVS_value'] = inputVS_value;
                        pushItems['inputVS.updated'] = isoDateTime;
                      } catch (err) {
                        throw new Error(err);
                      }
                    }

                    if (anagInput0_10v_value !== undefined && typeof anagInput0_10v_value === 'number') {
                      try { 
                        // Prepare the items to be pushed into the arrays
                        pushItems['anagInput0_10v.anagInput0_10v_value'] = anagInput0_10v_value;
                        pushItems['anagInput0_10v.updated'] = isoDateTime;
                      } catch (err) {
                        throw new Error(err);
                      }
                    }

                    if (inputVSS_value !== undefined && typeof inputVSS_value === 'number') {
                      try { 
                        // Prepare the items to be pushed into the arrays
                        pushItems['inputVSS.inputVSS_value'] = inputVSS_value;
                        pushItems['inputVSS.updated'] = isoDateTime;
                      } catch (err) {
                        throw new Error(err);
                      }
                    }

          const validateAndSet = (parentKey, key, value) => {
            if(value !== undefined){
            // booleans states
              if(typeof value === 'boolean'){
                if (parentKey){
                  setItems[parentKey] = setItems[parentKey] || {};
                  setItems[parentKey][key] = value;
                } else {
                  setItems[key] = key;
                }
              }
            }
          }
          //outputs
          validateAndSet('output1', 'output1_state', output1_state);
          validateAndSet('output2', 'output2_state', output2_state);
          validateAndSet('output3', 'output3_state', output3_state);

          //inputs
          validateAndSet('input1', 'input1_state', input1_state);
          validateAndSet('input2', 'input2_state', input2_state);
          validateAndSet('input3', 'input3_state', input3_state);
          validateAndSet('input4', 'input4_state', input4_state);
          validateAndSet('input5', 'input5_state', input5_state);
          validateAndSet('input6', 'input6_state', input6_state);
          validateAndSet('input7', 'input7_state', input7_state);
          validateAndSet('input8', 'input8_state', input8_state);

         

                
                    // SERIAL NUMBER SEARCH
                    const exists = await Dbschema.exists({ serialNumber });
                
                    if (!exists) {
                      throw new Error('ERROR serialNumber NOT FOUND');
                    } else {
                     
                
                      // DB insert/update
                      const options = { new: true };
                      if (Object.keys(pushItems).length > 0) {
                       
                        await Dbschema.findOneAndUpdate(
                          { serialNumber },
                          { $push: pushItems, $set: setItems },
                          options
                        );
                      }
                
                      res.status(201).end();
                    }
                
                  } catch (err) {
                    console.error(`Error handling POST request at '/BMS-update': ${err}`);
                    res.status(400).json({ message: err.message });
                  }
        });
                

  

          // Create a new asset
      router.post('/create', async (req, res) => {

          const newAsset = new Dbschema({
                
          })
          try{
              const saveAsset = await newAsset.save();
              res.status(201).json(saveAsset);
              console.log("Create ok");
          } catch (err) {
              res.status(400).json({message: err.message});
          }
        });



      //auto route
      router.post('/auto', async (req, res) => {

        try{
    
          let idPosted = req.body.id
          let payload = {};
  
              
            //ID VALIDATING
          const exists = await Dbschema.exists({ _id: idPosted});
          if (idPosted === undefined || idPosted.length !== 24){ // VALIDATING ID
          throw new Error (`ERROR INVALID ID ==>  ${idPosted}`)
          }  
          if(!exists){
          throw new Error ('ERROR ID NOT FOUND')
          }
          localdate();


          let query = await Dbschema.findById(idPosted).exec();
          //console.log("Monitoring route Hit!")


          payload.auto = query.auto;
          payload.setPoint = query.setPoint;
          payload.analogueOutput = query.analogueOutput;


          //console.log(req.body);
          //console.log(" ");
          res.status(200).json(payload);
          //res.status(200).end();
  
        }
        catch(Error){
          console.error(`Error handling POST request at '/auto' : => ${Error}`);
          res.status(400).json({message: Error.message});
        }
    
    
    
      })





















  module.exports = router