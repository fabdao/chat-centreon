import Table from 'cli-table3';
import colors from 'colors';
import PouchDB from 'pouchdb';
import readlineSync from 'readline-sync';

export class Users
{
    table = [];
    localUsersDB;
    remoteUsersDB;
    userID;
    userFullName;

    constructor( dbHost, dbPort, dbLogin, dbPassword )
    {
        this.initDB( dbHost, dbPort, dbLogin, dbPassword );

        this.table = new Table(
            { head: ['', 'Status'.cyan, "Last time co or message at".yellow, "Number of messages".magenta] }
        );

    }

    initDB( dbHost, dbPort, dbLogin, dbPassword)
    {
        this.localUsersDB = new PouchDB('users');
        this.remoteUsersDB = new PouchDB(dbHost +':'+ dbPort + '/users', {auth : {username : dbLogin, password : dbPassword}});

        this.localUsersDB.sync(this.remoteUsersDB, {
            live: true,
            retry: true
        }).on('change', function (change) {
            // yo, something changed!
           // console.log('Yo, something changed !');
        }).on('paused', function (info) {
            // replication was paused, usually because of a lost connection
        }).on('active', function (info) {
            // replication was resumed
        }).on('error', function (err) {
            // totally unhandled error (shouldn't happen)
        });
    }

    async login()
    {
        let answer = '';
        let isNewUser = false;
        let login = '';
        let fullName = '';

        while ( answer !== 'y' && answer !== 'n')
        {
            answer = readlineSync.question(`Is your first connexion ? (y/n) : `);
            if(answer === 'y') isNewUser = true;
            if(answer === 'n') isNewUser = false;
        }

        //First connexion, need create user !
        if(isNewUser)
        {
            do
            {
                login = readlineSync.question(`Please, enter an unused login shorter than 20 chars : `);

                if (!this.isValidLoginStr(login))
                {
                    console.log('Login longer than 20 chars or empty...'.yellow);
                    login = ''; continue;
                }

                if (await this.checkUser(login))
                {
                    console.log('Already used, please choose another login...'.red);
                    login = '';
                }
            }
            while ( login === '' );

            fullName = readlineSync.question(`Enter a nickname witch will appears for others users : `.cyan);
            await this.createUser(login, fullName);
            console.clear();
            this.userID = login;
            this.userFullName = fullName;
        }
        //On going connexion, need to find used login
        else
        {
            do
            {
                login = readlineSync.question(`Please, enter your last login : `);

                if (! await this.checkUser(login))
                {
                    console.log('Login not found, try again please...'.red);
                    login = '';
                }
            }
            while ( login === '' );

           console.clear();
        }
    }

    async createUser(login, fullName)
    {
        let newUser = {
            "_id": login,
            "name": fullName,
            "connected": true,
            "nbMessage": 0,
            "lastMessageTime" : new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        };

        return this.localUsersDB.put(newUser).then( () => {
            console.info('User '.green + fullName.cyan + ' ('.green + login.red + ') was create successfully !'.green);
            return this.localUsersDB.get(login);
        }).catch( (err) => {
            console.error('An error occur during user creation !');
            console.log(err);
        });
    }

    async checkUser(login)
    {
        return this.localUsersDB.get(login).then( (doc) => {
            console.log(doc);
            this.userID = doc._id;
            this.userFullName = doc.name;
            return true;
        }).catch( (err) => {
            if (err.error ==='not_found' || err.reason ==='missing') return false;
            else {
                console.error('An error occur during user checking !');
                console.log(err);
            }
        });
    }

    isValidLoginStr(login)
    {
        return String(login).length > 0 && String(login).length < 20;
    }

    async fetchAllUsers()
    {
        return this.localUsersDB.allDocs({
            include_docs: true,
            attachments: false
        }).then(function (result) {
            //console.log(result);
            return result;
        }).catch(function (err) {
            console.error('An error occurs during all users fetching !');
            console.log(err);
        });
    }

    async updateUser (pDocUpData)
    {
        return this.localUsersDB.get(this.userID).then((doc) => {

            for (const [key, value] of Object.entries(pDocUpData)) {
                //console.log(`${key}: ${value}`);
                doc[key] = value;
            }
            return this.localUsersDB.put(doc);

        }).then(() => {
            return this.localUsersDB.get(this.userID);
        });
    }

    async populateTable()
    {
        let tempTable = [
            [
                '{white-fg}User{/}',
                '{cyan-fg}Status{/}',
                '{yellow-fg}Last time co or message at{/}',
                '{magenta-fg}Number of messages{/}'
            ]
        ];

        return this.fetchAllUsers().then( (result) => {
            result.rows.forEach( el => {
                let tempName = '{cyan-fg}'+el.doc.name+'{/}'+' ('+'{magenta-fg}'+el.doc._id+'{/}'+')';
                let tempConnected = el.doc.connected ? '{green-fg}Online{/}' : '{red-fg}Offline{/}' ;
                let tempNbMessage = '{white-fg}' + el.doc.nbMessage + '{/}';
                let temp = [ tempName, tempConnected, el.doc.lastMessageTime, tempNbMessage ];
                tempTable.push(temp);
            });
            this.table = tempTable;
            console.log(this.table);
        });
    }
}
