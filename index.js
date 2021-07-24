import process from 'process';

import CONFIG from './config/backend.js';
import askConfig from './src/askConfig.js';
import { Users } from './src/users.js';

console.clear();

//Default backend config from config file binded into global variables
global.dbHost = CONFIG.dbHost;
global.dbPort = CONFIG.dbPort;
global.dbLogin = CONFIG.dbLogin;
global.dbPassword = CONFIG.dbPassword;

// Asking for eventual rebinding for config variables
askConfig();

// Init Super class
let users = new Users( global.dbHost, global.dbPort, global.dbLogin, global.dbPassword );

//@todo
//import fs from 'fs';
//fs.writeFileSync('./logs/connexion123', new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) +'\n');

// Register logout process when the process exit with ctrl+D or else....
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, () => {
        users.updateUser({
            connected : false
        }).then(() => {
            process.exit();
        });
    });
});

//Login process
users.login().then(() => {
    //Update connected flag and new arrival time
    users.updateUser({
        connected : true,
        "lastMessageTime" : new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    }).then(() => {
        //Hydrate the users table see who is connected or late to the daily scrum...
        users.populateTable().then(() => {
            //Display the new user tab...
            users.print();
        });
    });
});


