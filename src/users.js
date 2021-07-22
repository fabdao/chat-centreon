import Table from 'cli-table3';
import colors from 'colors';

//import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb'

export class Users
{
    table;
    localUsersDB;
    remoteUsersDB;

    constructor( dbHost, dbPort, dbLogin, dbPassword )
    {
        this.initDB( dbHost, dbPort, dbLogin, dbPassword );

        this.table = new Table(
            {head: ['', 'Status'.cyan, "Last message at".yellow, "Number of messages".magenta]}
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

    async fetchAllUsers()
    {
        return this.remoteUsersDB.allDocs({
            include_docs: true,
            attachments: false
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch(function (err) {
            console.error('An error occurs during all users fetching !');
            console.log(err);
        });
    }

    async createUser(login, fullName)
    {
        let newUser = {
            "_id": login,
            "name": fullName,
            "connected": true,
            "nbMessage": 0
        };

        return this.localUsersDB.put(newUser).then( () => {
            console.info('User ' + login + ' was create successfully !');
            return this.localUsersDB.get(login);
        }).catch( (err) => {
            console.error('An error occur during user creation !');
            console.log(err);
        });
    }

    async checkUser(login)
    {
        return this.remoteUsersDB.get(login).then( (doc) => {
            //console.log(doc);
            return true;
        }).catch( (err) => {
            if (err.error ==='not_found') return false;
            else {
                console.error('An error occur during user checking !');
                console.log(err);
            }
        });
    }

    checkLogin(login)
    {
        if(String(login).length < 20) return true;
        else return false;
    }

    print()
    {
        console.log(this.table.toString());
    }
}
