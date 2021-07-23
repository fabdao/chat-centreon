import readlineSync from 'readline-sync';

import CONFIG from './config/backend.js';
import askConfig from './src/askConfig.js';
import { Users } from './src/users.js';

let isNewUser = false;

//Default backend config from config file binded into global variables
global.dbHost = CONFIG.dbHost;
global.dbPort = CONFIG.dbPort;
global.dbLogin = CONFIG.dbLogin;
global.dbPassword = CONFIG.dbPassword;

//Eventual rebinding for config variables
askConfig();

let users = new Users( global.dbHost, global.dbPort, global.dbLogin, global.dbPassword );



users.print();

//users.createUser('spoinky', 'Spoinky');

// console.log(users.checkLogin('spoinky'));
// console.log(users.checkLogin('012345678901234567890'));
// console.log( await users.checkUser('spoinky'));
// console.log( await users.checkUser('spoinky1234'));
// users.fetchAllUsers().then((result) => {console.log(result)});

//console.log(global);

// intro().then( () => {
//     console.warn('then intro main file');
// });
//
// console.warn('after intro main file');
// //console.log(global);

