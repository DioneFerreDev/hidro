const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const electronEjs = require('electron-ejs');
const isMac = process.platform === 'darwin' ? true : false;
// const client = require('./controllers/math/math');
const { values } = require('./controllers/math/values');
const { windows } = require('./controllers/windows/windowController');
const ejs = require('ejs-electron');
const os = require('os');
const path = require('path');
let destinationPath = path.join(os.homedir(), 'PDF');
const { hidroMenu } = require('./controllers/menu/menu');

hidroMenu.playMenu();


// const {db} = require('./selfDb');
// db.save((err) => {
//     if (err) {
//         console.log(err);
//     }
// });

let diaInterno = null;

app.whenReady().then(() => {
    windows.createWindow(values);
})
// ipcMain.on('sendValor', () => {console.log('mandor o valor atraves do ipcrenderer')})
ipcMain.on('openUtilization', (e, value) => {
    windows.createPUtilization(value);
});
// ipcMain.on('openSavedWindow', () => {
//     windows.createSavedWindow();
// })
ipcMain.on('openInformation', (e, value) => {
    values.idInformation = value.id;
    windows.createInformation();
})
ipcMain.on('openInformationGeral', (e, value) => {
    values.dataTrechos = value.data;
    windows.createInformationGeral(destinationPath);
})
ipcMain.on('openComp', (e, value) => {
    let dia = { diameter: value.diameter };
    diaInterno = dia;
    windows.createComprimentoWindow(values);
})
ipcMain.on('sendLastRowId', (e, value) => {
    values.LastId = value.lastRowId;
});
ipcMain.on('save-project', (e, valor) => {

    windows.createSaveProject({ trechos: valor.trechos, pecas: values.pUtilization, conexoes: values.conexoesTrechos, upload: valor.upload, id: valor.id });
})
ipcMain.on('useProjectSaved', (e, doc) => {
    values.conexoesTrechos = doc.projeto.conexoes;
    values.pUtilization = doc.projeto.pecas;
    values.trechosSaved = doc.projeto.trechos;
    values.carregarProjeto = true;
    values.carregarId = doc.id;
})
ipcMain.on('projectSavedToTrue', () => {
    values.carregarProjeto = true;
})
ipcMain.on('notLoaded', () => {
    values.carregarProjeto = false;
})
ipcMain.on('deleteConxoesAndPecas', (e, value) => {
    let id = value.id;
    let order = null;
    for (let i = 0; i < values.pUtilization.length; i++) {
        if (values.pUtilization[i].idTrecho == id) {
            order = i;
        }
    }
    if (order != null) {
        values.pUtilization.splice(order, 1);
    }
    order = null;

    for (let i = 0; i < values.conexoesTrechos.length; i++) {
        if (values.conexoesTrechos[i].idTrecho == id) {
            order = i;
        }
    }
    if (order != null) {
        values.conexoesTrechos.splice(order, 1);
    }
    order = null;

})
ipcMain.handle('geBackLastId', async () => {
    await values.LastId;
    return values.LastId;
})
ipcMain.handle('getProjectData', async () => {
    await values.dataTrechos;
    await values.conexoesTrechos;
    await values.pUtilization;

    return { trechos: values.dataTrechos, conexoes: values.conexoesTrechos, pecas: values.pUtilization };
})
// ipcMain.on('testValue', (e, value) => {
//     client.value = value.test;
// });
ipcMain.handle('getDia', async (e) => {
    await diaInterno;
    return diaInterno.diameter;
})
ipcMain.handle('isLoaded', async () => {
    await values.carregarProjeto;
    await values.trechosSaved;

    return { ok: values.carregarProjeto, trechos: values.trechosSaved };
});
ipcMain.on('closeUtilization', (e, value) => {
    values.peso = value.peso;
    values.vazao = value.vazao;
    values.pressaoMinima = value.pressaoMinima;

    let peca = { idTrecho: value.idTrecho, peca: value.namePeca, peso: value.peso, vazao: value.vazao, pressaoMinima: value.pressaoMinima };
    values.pUtilization.push(peca);
})
ipcMain.on('upDatingUtilization', (e, value) => {
    values.peso = value.peso;
    values.vazao = value.vazao;
    values.pressaoMinima = value.pressaoMinima;

    values.pUtilization.forEach(peca => {
        if (peca.idTrecho == value.idTrecho) {
            peca.peca = value.namePeca;
            peca.peso = value.peso;
            peca.vazao = value.vazao;
            peca.pressaoMinima = value.pressaoMinima;
            return
        }
    });
});
ipcMain.on('projectInformationPDF', (e, value) => {
    values.pecasPDF = value.pecas;
    values.tubulacoesPDF = value.tubulacoes;
    values.conexoesPDF = value.conexoes;

    let ejs = new electronEjs({ pecas: value.pecas, tubulacoes: value.tubulacoes, conexoes: values.conexoes }, {});    
    windows.createProjectInformationPDF({ pecas: value.pecas, tubulacoes: value.tubulacoes, conexoes: value.conexoes, pdf: 'information' });
})
ipcMain.handle('verifyLastidTrecho', async () => {
    let peca = await { ok: false, name: 'nenhum' }
    if (values.pUtilization.length > 0) {

        if (values.pUtilization[values.pUtilization.length - 1].idTrecho == 'provision') {
            let file = values.pUtilization[values.pUtilization.length - 1];
            // { idTrecho: value.idTrecho, peca: value.namePeca, peso: value.peso, vazao: value.vazao, pressaoMinima: value.pressaoMinima };
            peca = await { ok: true, name: file.peca, peso: file.peso, vazao: file.vazao, pressaoMinima: file.pressaoMinima };
            values.pUtilization = values.pUtilization.filter(peca => { return peca.idTrecho != 'provision' });
        }
    }
    return peca;
})
ipcMain.handle('seekingPecas', async () => {
    await values.pUtilization;

    return values.pUtilization;
});
ipcMain.handle('upLoadProject', async () => {
    await values.carregarId;
    return values.carregarId;
})
ipcMain.handle('show-dialog', async (e, destination) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    const dirPath = result.filePaths[0];
    destination = dirPath;
    return destination;
})
ipcMain.on('sendComp', (e, value) => {
    values.comprimentoEquivalente = value.comprimentoEquivalente;
    values.conexoesTrechos.push(value.conexao);
})
ipcMain.on('deleteLastConexoesProvision', () => {
    values.conexoesTrechos = values.conexoesTrechos.filter(trechos => { return trechos.idTrecho != 'provision' });
})
ipcMain.on('resetVazaoPesoPressao', () => {
    values.peso = null;
    values.pressaoMinima = null;
    values.vazao = null;
})
ipcMain.handle('getIDConexao', async (e) => {
    await values.conexoesTrechos;

    return values.conexoesTrechos;
})
ipcMain.handle('pecaUtilization', async () => {
    await values.pUtilization;

    return values.pUtilization;
})
ipcMain.handle('getIdEdit', async (e) => {
    await values.idEdit;

    return values.idEdit;
})
ipcMain.handle('getIdInformation', async (e) => {
    await values.idInformation;

    return values.idInformation;
})
ipcMain.handle('getIdEditUtilization', async () => {
    await values.idEditUtilization;
    return values.idEditUtilization;
})
ipcMain.handle('getInformationPDF', async () => {
    await values.pecasPDF;
    await values.conexoesPDF;
    await values.tubulacoesPDF;

    return { pecas: values.pecasPDF, conexoes: values.conexoesPDF, tubulacoes: values.tubulacoesPDF }
})
ipcMain.on('rowEdit', () => {
    values.idEdit = null;
})
ipcMain.on('sendingIDtoConexoes', (e, value) => {
    let id = value.id;

    if (values.conexoesTrechos[values.conexoesTrechos.length - 1].idTrecho == 'provision') {
        values.conexoesTrechos[values.conexoesTrechos.length - 1].idTrecho = id;
    }
    if (values.pUtilization.length != 0) {
        if (values.pUtilization[values.pUtilization.length - 1].idTrecho == 'provision') {
            values.pUtilization[values.pUtilization.length - 1].idTrecho = id;
        }
    }
});
ipcMain.on('passingidEdit', (e, value) => {
    values.idEdit = value.id;
})
ipcMain.on('deleteTrechoConexaoEdit', (e, value) => {
    values.conexoesTrechos = values.conexoesTrechos.filter(trecho => { return trecho.idTrecho != value.id })
})
ipcMain.on('correctDiameterConexao', (e, value) => {
    values.conexoesTrechos.forEach(trecho => {
        if (trecho.idTrecho == value.id) {
            trecho.dataConexoes.forEach(conexao => {
                conexao.diameter = value.diameter;
            });
        }
    });
})
ipcMain.on('deletePecainTrecho', (e, value) => {
    values.pUtilization.forEach(peca => {
        if (peca.idTrecho == value.idTrecho) {
            peca.peca = value.peca;
            peca.peso = value.peso;
            peca.vazao = value.vazao;
            peca.pressaoMinima = value.pressaoMinima;
            return;
        }
    });
})
ipcMain.on('idTrechoPeca', (e, value) => {
    values.idEditUtilization = value.idTrecho;
});
ipcMain.on('openTrechosPDF', (e, value) => {
    windows.createProjectInformationPDF({ trechos: value.trechos, pdf: 'trecho' });
});
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(values);
    }
})


