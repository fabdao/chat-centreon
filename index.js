//let CONFIG = import('./config/backend.js');
import CONFIG from './config/backend.js';
import { Users } from './src/users.js';

console.log(CONFIG);

let dbHost = CONFIG.dbHost;
let dbPort = CONFIG.dbPort;
let dbLogin = CONFIG.dbLogin;
let dbPassword = CONFIG.dbPassword;

let users = new Users( dbHost, dbPort, dbLogin, dbPassword );
users.print();

//users.createUser('spoinky', 'Spoinky');

console.log(users.checkLogin('spoinky'));
console.log(users.checkLogin('012345678901234567890'));
console.log( await users.checkUser('spoinky'));
console.log( await users.checkUser('spoinky1234'));
users.fetchAllUsers().then((result) => {console.log(result)});
