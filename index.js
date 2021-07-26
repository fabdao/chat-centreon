import process from 'process';

import CONFIG from './config/backend.js';
import askConfig from './src/askConfig.js';
import { Users } from './src/users.js';
import { Messages } from './src/messages.js';
import { Display } from './src/display.js';

console.clear();

//Default backend config from config file binded into global variables
global.dbHost = CONFIG.dbHost;
global.dbPort = CONFIG.dbPort;
global.dbLogin = CONFIG.dbLogin;
global.dbPassword = CONFIG.dbPassword;

// Asking for eventual rebinding for config variables
askConfig();

// Init Super class
let display = new Display();
let users = new Users( global.dbHost, global.dbPort, global.dbLogin, global.dbPassword, display );
let messages = new Messages( global.dbHost, global.dbPort, global.dbLogin, global.dbPassword, display );

//@todo
//import fs from 'fs';
//fs.writeFileSync('./logs/connexion123', new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) +'\n');

//Login process
users.login().then(() => {

    //Init Display
    display.initDisplay(users, messages);

    //Update connected flag and new arrival time
    users.updateUser({
        connected : true,
        "lastMessageTime" : new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    }).then( () => {
        //Hydrate the users table see who is connected or late to the daily scrum...
        users.populateTable().then(() => {
            messages.populateTable().then(() => {
                //Display the new user tab...
                display.updateUserBox(users.table);
                //Display the new message tab...
                display.updateMessageBox(messages.table);
            });
        });
    });
});





