import PouchDB from "pouchdb";

export class Messages
{
    table = [];
    localUsersDB;
    remoteUsersDB;

    constructor( dbHost, dbPort, dbLogin, dbPassword )
    {
        this.initDB( dbHost, dbPort, dbLogin, dbPassword );
    }

    initDB( dbHost, dbPort, dbLogin, dbPassword)
    {
        this.localUsersDB = new PouchDB('messages');
        this.remoteUsersDB = new PouchDB(dbHost +':'+ dbPort + '/messages', {auth : {username : dbLogin, password : dbPassword}});

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

    async sendMessage(login, fullName, message)
    {
        let newMessage = {
            "_id": new Date().toJSON(),
            "userId": login,
            "userFullName": fullName,
            "messageTxt": message,
            "messageTime" : new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        };

        return this.localUsersDB.put(newMessage).then( () => {
            return this.localUsersDB.get(newMessage._id);
        }).catch( (err) => {
            console.error('An error occur during message sending !');
            console.log(err);
        });
    }

    async fetchAllMessages()
    {
        return this.localUsersDB.allDocs({
            include_docs: true,
            attachments: false,
            limit: 300
        }).then(function (result) {
            //console.log(result);
            return result;
        }).catch(function (err) {
            console.error('An error occurs during all messages fetching !');
            console.log(err);
        });
    }

    async populateTable()
    {
        let tempTable = [];

        return this.fetchAllMessages().then( (result) => {
            console.log(result);
            result.rows.forEach( el => {
                    let tempName = '{cyan-fg}'+el.doc.userFullName+'{/}'+' ('+'{magenta-fg}'+el.doc.userId+'{/}'+')';
                    let tempMessageTime = '{yellow-fg}' + el.doc.messageTime + '{/}';
                    let tempMessageTxt = '{white-fg}' + el.doc.messageTxt + '{/}';
                    tempTable.push(tempName + ' @ ' + tempMessageTime + ' : ' + tempMessageTxt);
                });
            this.table = tempTable;
        });
    }
}
