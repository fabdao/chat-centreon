import readlineSync from 'readline-sync';

export default function askConfig ()
{
    let answer = '';

    answer = readlineSync.question(`Database remote URL ? (Default : ${global.dbHost}) : `);
    if(answer !== '') global.dbHost = answer;

    answer = readlineSync.question(`Database remote PORT ? (Default : ${global.dbPort}) : `);
    if(answer !== '') global.dbPort = answer;

    answer = readlineSync.question(`Database remote LOGIN ? (Default : ${global.dbLogin}) : `);
    if(answer !== '') global.dbLogin = answer;

    answer = readlineSync.question(`Database remote PASSWORD ? (Default : ${global.dbPassword}) : `, {hideEchoBack: true});
    if(answer !== '') global.dbPassword = answer;

    console.clear();
}
