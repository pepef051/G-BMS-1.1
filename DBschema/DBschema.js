const mongoose = require('mongoose');



const apiSchema = new mongoose.Schema({
                
                Asset: {
                type: String,
                default: 'My Asset'
                },
                serialNumber: {
                        type: Number,
                        default: 0
                },
                apiMonitoringSyncTime: {
                        type: Number,
                        default: 60000
                },
                apiSyncTime: {
                        type: Number,
                        default: 10000
                },
                location: {
                        type: String,
                        default:'Kent Depot'
                },
                link: {
                        type: String,
                        default:''
                },
                stop: {
                        type: Boolean,
                        default: false
                },
                monitoring: {
                        type: Boolean,
                        default: false
                },
                auto: {
                        type: Boolean,
                        default: false
                },
                reset: {
                        type: Boolean,
                        default: false
                },

                anagOutput0_10v: {        
                        anagOutput0_10v_name: { type: String, default: 'Three way Valve' },
                        anagOutput0_10v_value:{ type: Number, default: 0}    
                                },
                setPoint: {
                        type: Number,
                        default: 20
                },

                alarm: {
                        type: Boolean,
                        default: false
                },
                output1: {
                        
                            output1_name: { type: String, default: 'Boiler Start/Stop' },
                            output1_state: { type: Boolean, default: false }
                        
                },
                output2: {
                        
                        output2_name: { type: String, default: 'Pump Start/Stop' },
                        output2_state: { type: Boolean, default: false }
                    
            },

            output3: {        
                output3_name: { type: String, default: 'Reset (1.5s)' },
                output3_state: { type: Boolean, default: false }
                        },
                        // are 8 outputs on the board but by now would be used just 3
                input1: {        
                input1_name: { type: String, default: 'input1 boiler hand / auto' },
                input1_state: { type: Boolean, default: false }   
                        },

                input2: {        
                input2_name: { type: String, default: 'input2 pump hand / auto' },
                input2_state: { type: Boolean, default: false }    
                        },
                
                input3: {        
                input3_name: { type: String, default: 'input3 alarm burner' },
                input3_state: { type: Boolean, default: false } 
                        },
                input4: {        
                input4_name: { type: String, default: 'input4 burner runnig signal' },
                input4_state: { type: Boolean, default: false } 
                        },
                input5: {        
                input5_name: { type: String, default: 'input5 differential pressure switch' },
                input5_state: { type: Boolean, default: false }  
                        },
                input6: {        
                input6_name: { type: String, default: 'input6 PU Alarm' },
                input6_state: { type: Boolean, default: false }   
                        },
                input7: {        
                input7_name: { type: String, default: 'input7 pump alarm' },
                input7_state: { type: Boolean, default: false }  
                        },
                input8: {        
                input8_name: { type: String, default: 'input8 stop emergency button' },
                input8_state: { type: Boolean, default: false }   
                        },
                inputVS: {        
                inputVS_name: { type: String, default: 'Flow temperature' },
                inputVS_value: [{ type: Number, default: 0.0}],
                updated: [{ type: Date, default: Date.now}]     
                        },
                inputVSS: {        
                inputVSS_name: { type: String, default: 'Return Temperature' },
                inputVSS_value: [{ type: Number, default: 0.0 }],
                updated: [{ type: Date, default: Date.now}]     
                        },
                anagInput0_10v: {        
                anagInput0_10v_name: { type: String, default: 'Pressure' },
                anagInput0_10v_value: [{ type: Number, default: 0.0 }],
                updated: [{ type: Date, default: Date.now}]     
                        },
         
        
});

module.exports = mongoose.model('RM-BOX', apiSchema);   //here you can set a DB name ''