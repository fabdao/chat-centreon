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

    constructor( dbHost, dbPort, dbLogin, dbPassword )
    {
        this.initDB( dbHost, dbPort, dbLogin, dbPassword );

        this.table = new Table(
            { head: ['', 'Status'.cyan, "Last message at".yellow, "Number of messages".magenta] }
        );

        this.table.push(
            { 'Fabrice': ['Online'.green, '2020-02-21 11:42', '3'] },
            { 'Laura': ['Offline'.red, '2020-02-21 11:48', '4'] }
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
            console.log('Yo, something changed !');
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
            this.userID = login;
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
            //console.log(doc);
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
        if(String(login).length > 0 && String(login).length < 20) return true;
        else return false;
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

    async populateTable()
    {
        let tempTable = [];

        return this.fetchAllUsers().then( (result) => {
            result.rows.forEach( el => {
                console.log(el)
                var tempName = el.doc.name.cyan + ' (' + el.doc._id.red + ')';
                let tempConnected = el.doc.connected ? 'Online'.green : 'Offline'.red ;
                let temp = {};
                temp[tempName] = [ tempConnected, el.doc.lastMessageTime, el.doc.nbMessage ];
                this.table.push(temp);
            });
        });
    }

    print()
    {
        console.log(this.table.toString());
    }
}
