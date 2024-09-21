const { BrowserWindow } = require('electron');
const isDev = (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') ? true : false;
const client = require('../math/math');
const path = require('path');
const { url } = require('inspector');
// const { values } = require('../math/values');


const windows = {
    createWindow(values) {
        win = new BrowserWindow({
            width: 2000,
            minWidth: 1000,
            minHeight: 700,
            show: false,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        });
        win.loadFile(path.join(__dirname, '../../public/mainwindow/index.html'));

        // win.loadFile(__dirname, `${__dirname}/public/mainwindow/index.html`);
        if (isDev) {
            win.webContents.openDevTools();
        }
        win.once('ready-to-show', () => {
            win.show();
        });
        win.on('focus', () => {
            // win.webContents.send('valorTest', client.value);
            if (values.peso != null && values.pressaoMinima != null && values.vazao != null) {
                win.webContents.send('sendingVazaoandPeso', values);
            }
            if (values.comprimentoEquivalente !== null) {
                win.webContents.send('sendCompTotal', values.comprimentoEquivalente);
                values.comprimentoEquivalente = null;
            }
            client.value = null;
            if (values.carregarProjeto) {
                win.webContents.send('sendProjectSaved', { trechos: values.trechosSaved, pecas: values.pUtilization, conexoes: values.conexoesTrechos });
                values.carregarProjeto = false;
            }
        })
    },
    createPUtilization(values) {

        winChild = new BrowserWindow({
            parent: win,
            width: 1000,
            minWidth: 800,
            height: 680,
            minHeight: 660,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            modal: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        winChild.loadFile(path.join(__dirname, '../../public/childWindow/index.html'));
        if (isDev) {
            winChild.webContents.openDevTools();
        }
        winChild.once('ready-to-show', () => {
            winChild.show();
        });

    },
    createComprimentoWindow(values) {
        const compChild = new BrowserWindow({
            parent: win,
            width: 1000,
            minWidth: 800,
            height: 600,
            minHeight: 660,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            modal: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        compChild.loadFile(path.join(__dirname, '../../public/compWindow/index.html'));
        if (isDev) {
            compChild.webContents.openDevTools();
        }
        compChild.once('ready-to-show', () => {
            compChild.show();
            compChild.webContents.send('sendLastRow', values.LastId);
        })
        // compChild.on('show', () => {
        //     console.log(values.LastId);
        // })
    },
    createInformation(value) {
        const infoChild = new BrowserWindow({
            parent: win,
            width: 1000,
            minWidth: 800,
            height: 600,
            minHeight: 660,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            modal: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        infoChild.loadFile(path.join(__dirname, '../../public/infoWindow/index.html'));
        if (isDev) {
            infoChild.webContents.openDevTools();
        }
        infoChild.once('ready-to-show', () => {
            infoChild.show();
            // infoChild.webContents.send('sendLastRow',values.LastId); 
        })
    },
    createInformationGeral(destination) {
        infoChild = new BrowserWindow({
            parent: win,
            width: 1100,
            minWidth: 800,
            height: 600,
            minHeight: 660,
            modal: true,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        infoChild.loadFile(path.join(__dirname, '../../public/infoProjectWindow/index.html'));
        if (isDev) {
            infoChild.webContents.openDevTools();
        }
        infoChild.once('ready-to-show', () => {
            infoChild.show();
            infoChild.webContents.send('send-destination', destination);
        })
    },
    createSaveProject(project) {
        const saveChild = new BrowserWindow({
            parent: win,
            width: 800,
            minWidth: 600,
            height: 400,
            minHeight: 300,
            modal: true,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        saveChild.loadFile(path.join(__dirname, '../../public/saveWindow/index.html'));
        if (isDev) {
            saveChild.webContents.openDevTools();
        }
        saveChild.once('ready-to-show', () => {
            saveChild.show();
            console.log(project.upload);
            saveChild.webContents.send('send-trechos', project);
        })
    },
    createSavedWindow() {
        const saveChild = new BrowserWindow({
            parent: win,
            width: 1000,
            minWidth: 800,
            height: 800,
            minHeight: 700,
            modal: true,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        saveChild.loadFile(path.join(__dirname, '../../public/savedProject/index.html'));
        if (isDev) {
            saveChild.webContents.openDevTools();
        }
        saveChild.once('ready-to-show', () => {
            saveChild.show();
            // saveChild.webContents.openDevTools();
            // saveChild.webContents.send('send-trechos', project);
        })
    },
    createProjectInformationPDF(valores) {
        const ejs = require('ejs');

        const informationPDF = new BrowserWindow({
            // parent: infoChild,
            parent: win,
            width: 1200,
            minWidth: 800,
            height: 750,
            minHeight: 660,
            modal: true,
            icon: path.join(__dirname, 'icons', 'icon2.png'),
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        let data = null;
        let options = null;
        let path = null;
        if (valores.pdf == 'information') {
            data = { pecas: valores.pecas, tubulacoes: valores.tubulacoes, conexoes: valores.conexoes };

            options = { root: '.public/infoProjectWindow' };
            path = '.public/infoProjectWindow/index.ejs';
            console.log(path);
        } else {
            data = { trechos: valores.trechos };
            options = { root: __dirname + '/public/infoProjectWindow' };
            path = __dirname + '/public/infoProjectWindow/trechospdf.ejs';
            console.log(path);
        }

        ejs.renderFile(path, data, options, (err, str) => {
            if (err) {
                console.log(err);
            } else {
                informationPDF.loadURL('data:text/html;charset=utf-8,' + encodeURI(str));
            }
        })
        if (isDev) {
            informationPDF.webContents.openDevTools();
        }
        informationPDF.once('ready-to-show', () => {
            informationPDF.show();
        })
    }
}



module.exports = { windows };