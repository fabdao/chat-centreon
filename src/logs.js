import fs from 'fs';
import ip from 'ip';
import extIP  from  'ext-ip';

export class Logs
{
    filePath = './logs/connexion';

    constructor( pFilePath )
    {
        if(pFilePath) this.filePath = pFilePath;
    }

    logUserConnection(pUserId)
    {
        extIP().get().then(ipEXT => {
            let temp = '';
            temp += new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) + ' * ';
            temp += pUserId + ' * ';
            temp += ip.address() + ' * ';
            temp += ipEXT + '\n';
            fs.appendFile(this.filePath, temp, function (err) {
                if (err) throw err;
            });
        })
        .catch(err => {
            if (err) throw err;
        });
    }
}
