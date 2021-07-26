import blessed from 'blessed';
import process from "process";

export class Display
{
    screen;
    chatBox;
    userBox;
    inputBar;

    constructor()
    {

    }

    initDisplay(pUsers, pMessages)
    {
        this.screen = blessed.screen({
            smartCSR: true
        });

        this.chatBox = blessed.box({
            parent: this.screen,
            top: 0,
            left: 0,
            width: '66%',
            height: '95%',
            style: {
                bg: 'black'
            },
            keys: true,
            mouse: true,
            vi: false,
            tags: true,
            alwaysScroll:true,
            scrollable: true,
            scrollbar: {
                style: {
                    bg: 'yellow'
                }
            }
        });

        this.inputBar = blessed.textbox({
            parent: this.screen,
            bottom: 0,
            left: 0,
            height: 1,
            width: '100%',
            keys: false,
            mouse: false,
            vi: false,
            tags: false,
            inputOnFocus: true,
            style: {
                fg: 'white',
                bg: 'grey'	// Blue background so you see this is different from body
            }
        });

        this.userBox = blessed.listtable({
            parent: this.screen,
            right: 0,
            border: 'line',
            align: 'center',
            scrollable: true,
            alwaysScroll:true,
            keys: true,
            mouse: true,
            vi: false,
            tags: true,
            width: '33%',
            height: '95%',
            interactive: false
        });

        this.chatBox.on('click', () => {
            this.chatBox.focus();
        });

        this.inputBar.on('click', () => {
            this.inputBar.focus();
        });

        this.userBox.on('click', () => {
            this.userBox.focus();
        });

        this.inputBar.on('submit', (text) => {
            pMessages.sendMessage(pUsers.userID, pUsers.userFullName, text).then(() => {
                pUsers.incUserInfoMessage().then(() => {
                    let tempName = '{cyan-fg}'+pUsers.userFullName+'{/}'+' ('+'{magenta-fg}'+pUsers.userID+'{/}'+')';
                    let tempMessageTime = '{yellow-fg}' + new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) + '{/}';
                    let tempMessageTxt = '{white-fg}' + text + '{/}';
                    this.chatBox.insertBottom(tempName + ' @ ' + tempMessageTime + ' : ' + tempMessageTxt);
                    this.inputBar.clearValue();
                    this.screen.render();
                });
            });
        });

        this.screen.key('enter', (ch, key) => {
            this.inputBar.focus();
        });

        // Register logout process when the process exit with escape, ctrl+D or else....
        this.screen.key(['escape', 'C-c'], (ch, key) => {
            pUsers.logoutUser().then(() => {
                process.exit(0);
            });
        });
    }

    updateUserBox(pData)
    {
        this.userBox.setData(pData);
        this.screen.render();
    }

    updateMessageBox(pData)
    {
        this.chatBox.setContent('');
        pData.forEach( el => {
            this.chatBox.insertBottom(el);
        });
        this.screen.render();
    }
}
