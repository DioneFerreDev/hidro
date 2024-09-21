const { ipcRenderer } = require('electron');
const { calcDiametro, calcDiametrosPadroes, calcSpeed, perdaPressao, comprimentoVirtual, CalculatingTable } = require('../../models/classes/calc');
const { fillTable } = require('../../models/classes/fillTable');
const loki = require('lokijs');
const read = require('read-file-utf8');
const path = require('path');
const db = new loki(path.join(__dirname, '../../models/save/db.json'));

let editRow = 'provision';
let edit = false;
let dataTable = [];
let importedProject = false;



document.addEventListener('DOMContentLoaded', async () => {
    // let dataTable = [];
    // managingScreen();
    const comprimentoTable = await readDB();
    managergScreen();
    gettingComp();
    getStartedTable()
    openInformation();
    // saveProject();
    deleteTrecho();
    generatePDF();
    saveProjectDB();
    projectSaved();

    ipcRenderer.on('sendingVazaoandPeso', (e, value) => {
        PecaUtilization(value);
    });
    document.querySelector('#utilization').addEventListener('click', () => {
        ipcRenderer.send('idTrechoPeca', { idTrecho: editRow });
        openModal();
    });
    document.querySelector('#nUtilization').addEventListener('click', () => {
        withoutUtilization();
    });
    document.querySelector('#comprimento').addEventListener('click', () => {
        openCompModal();
    })
    addTable();
    // changeDiameterAndComp();
    pressedEdit();
    changeDiameterAndComp(comprimentoTable);


});

function openModal() {
    ipcRenderer.send('openUtilization');
}
function openCompModal() {
    let dia = document.querySelector('#selectExterno').value;
    let row = document.querySelectorAll('.row');
    row = (row.length > 0) ? row[row.length - 1].id : null;

    ipcRenderer.send('sendLastRowId', { lastRowId: row });
    ipcRenderer.send('openComp', { diameter: dia });

}
function managergScreen() {
    const { managingScreen } = require('../scripts/mainObject');
    managingScreen.creatingTrechos();
    managingScreen.managingWater();
    managingScreen.managingPlubing();
    managingScreen.clickButtons();
}
function withoutUtilization() {

    verifyPeca();

    document.querySelector('#speed').value = '0';
    document.querySelector('#vazao').value = '0';
    document.querySelector('#pressaoMinima').value = '0';
    document.querySelector('#peso').value = '0';
    document.querySelector('#diaCalculado').value = '0';
}
function PecaUtilization(value) {
    document.querySelector('#peso').value = value.peso;
    document.querySelector('#vazao').value = value.vazao;
    document.querySelector('#pressaoMinima').value = value.pressaoMinima;

    let diametro = new calcDiametro(value.peso, 3);
    diametro = diametro.sendDiametro();
    diametro = diametro.toFixed(2);
    document.querySelector('#diaCalculado').value = diametro;

    // calculara velocidade
    new calcDiametrosPadroes(diametro);
    let speed = new calcSpeed(document.querySelector('#selectInterno').value, document.querySelector('#vazao').value);
    document.querySelector('#speed').value = speed.speed;
}
async function gettingComp() {
    // let compTotal = ipcRenderer.on('sendCompTotal');
    await ipcRenderer.on('sendCompTotal', (e, value) => {
        let compTotal = value;
        document.querySelector('#compTotal').value = compTotal.toFixed(2);
    });
}
function addTable() {
    document.querySelector('#add').addEventListener('click', () => {
        if (editRow == 'provision') {
            // fazer o calculo da perda de pressao, comprimento Virtual, pressaoTrechos,status.
            let boxes = document.querySelectorAll('.needed');
            let empty = false;
            boxes.forEach(box => {
                if (box.value == '' || box.value == null) {
                    empty = true;
                }
            });
            if (empty) {
                alert('Existe um ou mais campos não preenchidos!');
            } else {
                if (verifiTrechos())
                    actionTable(boxes);
                else
                    alert('Trechos incompatíveis!!');
            }
            async function actionTable(boxes) {
                let tableHeader = ['Trecho1', 'trecho2', 'P.acumulado', 'vazao', 'velocidade', 'comprimento', 'comp.equivalente', 'Perda.Pressão', 'Dia.interno', 'Dia.externo', 'Press.minima', 'comp.virtual', 'Alt.geométrica', 'Press.Trechos', 'status', 'agua'];

                let virtual = new comprimentoVirtual(document.querySelector('#comprimentoReal').value, document.querySelector('#compTotal').value,);
                virtual = virtual.calcComprimentoVirtual();
                let pPressao = new perdaPressao(document.querySelector('#vazao').value, document.querySelector('#selectInterno').value, document.querySelector('#comprimentoReal').value,
                    document.querySelector('#compTotal').value, document.querySelector('#agua').value);
                pPressao = pPressao.calcPerda();

                let ok = true;
                let id = Math.random().toString(36).substr(3);
                if (dataTable.length > 0) {
                    while (ok) {
                        ok = false;
                        let obj = dataTable.filter(row => row.id == id);
                        if (obj.length > 0) {
                            id = Math.random().toString(36).substr(3);
                            ok = true
                        }
                    }
                }

                let data = {
                    id: id, trecho1: document.querySelector('#montante').value, trecho2: document.querySelector('#jusante').value, peso: document.querySelector('#peso').value, pesoOriginal: document.querySelector('#peso').value,
                    vazao: document.querySelector('#vazao').value, velocidade: document.querySelector('#speed').value, comprimento: document.querySelector('#comprimentoReal').value,
                    comprimentoEquivalente: document.querySelector('#compTotal').value, perdaPressao: pPressao, dInterno: document.querySelector('#selectInterno').value, dExterno: document.querySelector('#selectExterno').value,
                    pressaoMinima: document.querySelector('#pressaoMinima').value, comprimentoVirtual: virtual, alturaGeometrica: document.querySelector('#aGeometrica').value,
                    pressaoTrechos: 7, status: 'aprovado', agua: document.querySelector('#agua').value
                };
                dataTable.push(data);


                // verificando se o projeto é carregado
                let loaded = await ipcRenderer.invoke('isLoaded');
                if (loaded.ok) {
                    ipcRenderer.send('notLoaded');
                }
                // como para valores n primitivos (arrays e ebjetos se utiliza referencias precisamos vazer um clone de array ou obj)
                let calculatedTable = [...dataTable];
                // calcutingTable(calculatedTable);
                new CalculatingTable(calculatedTable);

                let indices = ['trecho1', 'trecho2', 'peso', 'vazao', 'velocidade', 'comprimento', 'comprimentoEquivalente', 'perdaPressao', 'dInterno', 'dExterno', 'pressaoMinima', 'comprimentoVirtual', 'alturaGeometrica',
                    'pressaoTrechos', 'status', 'agua'];
                // let table = new fillTable(tableHeader, dataTable, indices);
                let table = new fillTable(tableHeader, calculatedTable, indices);
                table = table.buildTable();
                document.querySelector('#tableProject').innerHTML = '';
                await document.querySelector('#tableProject').appendChild(table);
                verifiStatus();
                editTrecho();

                // apagando todos os valores inseridos                              
                boxes.forEach(box => {
                    box.value = '';
                });
                document.querySelector('#selectInterno').value = '17';
                document.querySelector('#selectExterno').value = '20';
                ipcRenderer.send('resetVazaoPesoPressao');
                ipcRenderer.send('sendingIDtoConexoes', { id: id });
            }
        }
    });
    // editTrecho();
}
function verifiTrechos() {
    let ok = true;
    let trechoMontante = Number(document.querySelector('#montante').value);
    let trechoJusante = Number(document.querySelector('#jusante').value);
    if (document.querySelector('#montante').value == document.querySelector('#jusante').value || trechoMontante > trechoJusante) {
        ok = false;
    }
    let trechos = dataTable.filter(row => { return row.trecho1 == trechoMontante.toString() && row.trecho2 == trechoJusante.toString() });
    if (trechos.length > 0) {
        ok = false;
    }
    return ok;
}
async function calcutingTable(rows) {

    let trechoInserido = rows[rows.length - 1];
    let peso = Number(trechoInserido.peso);
    let montante = trechoInserido.trecho1;
    let jusante = trechoInserido.trecho2;

    let ok = true;
    while (ok == true) {
        ok = false;
        rows.forEach(row => {
            if (row.idTrecho1 != montante && row.trecho2 != jusante) {
                if (row.trecho2 == montante) {
                    let rowPeso = Number(row.peso);
                    rowPeso = rowPeso + peso;
                    row.peso = rowPeso.toString().toFixed(2);
                    montante = row.trecho1;
                    ok = true;
                    return;
                }
            }
        });
    }
}
function editTrecho() {
    document.querySelectorAll('.row').forEach(row => {
        row.addEventListener('click', () => {
            document.querySelector('#montante').value = row.children[0].innerHTML;
            document.querySelector('#jusante').value = row.children[1].innerHTML;
            document.querySelector('#peso').value = row.children[2].innerHTML;
            document.querySelector('#vazao').value = row.children[3].innerHTML;
            document.querySelector('#speed').value = row.children[4].innerHTML;
            document.querySelector('#comprimentoReal').value = row.children[5].innerHTML;
            document.querySelector('#compTotal').value = row.children[6].innerHTML;
            document.querySelector('#selectInterno').value = row.children[8].innerHTML;
            document.querySelector('#selectExterno').value = row.children[9].innerHTML;
            document.querySelector('#pressaoMinima').value = row.children[10].innerHTML;
            document.querySelector('#aGeometrica').value = row.children[12].innerHTML;
            document.querySelector('#agua').value = row.children[15].innerHTML;

            document.querySelector('#edit-project').classList.remove('not-selected');
            document.querySelector('#information').classList.remove('not-selected');
            document.querySelector('#delete-trecho').classList.remove('not-selected');
            document.querySelector('#add').classList.add('not-selected');
            document.querySelector('#add').classList.remove('add');
            // document.querySelector('#edit-project').classList.add('btn-selected');
            edit = true;

            editRow = row.id;
            ipcRenderer.send('passingidEdit', { id: editRow });
            document.querySelectorAll('.edit-blocked').forEach(obj => {
                obj.classList.add('not-selected');
                let attr = document.createAttribute('disabled');
                attr.value = 'true';
                obj.setAttributeNode(attr);
            });
        })
    });
}
function changeDiameterAndComp(comprimentoTable) {

    document.querySelector('#plubInt').addEventListener('change', async () => {
        let newDiameter = null;
        if (document.querySelector('#compTotal').value != '') {
            if (editRow == 'provision') {
                // Aqui então o trecho ainda não foi inserido na tabela porém é necessário mudar o comp devido a mudança de diametro.
                newDiameter = document.querySelector('#selectExterno').value;
            } else {
                // Aqui como o editRow tem um id correspondente a linha da tabela precisamos mudar o comp daquela linha
                newDiameter = document.querySelector('#selectExterno').value;
            }
            changingComp(editRow, newDiameter, comprimentoTable);
        }
    })
    document.querySelector('#plubExt').addEventListener('change', () => {
        let newDiameter = null;
        if (document.querySelector('#compTotal').value != '') {
            if (editRow == 'provision') {
                // Aqui então o trecho ainda não foi inserido na tabela porém é necessário mudar o comp devido a mudança de diametro.
                newDiameter = document.querySelector('#selectExterno').value;
            } else {
                // Aqui como o editRow tem um id correspondente a linha da tabela precisamos mudar o comp daquela linha
                newDiameter = document.querySelector('#selectExterno').value;
            }
            changingComp(editRow, newDiameter, comprimentoTable);
        }

    })
}
function pressedEdit() {

    document.querySelector('#edit-project').addEventListener('click', async () => {
        if (edit) {
            // Aqui faremos as mudanças necessárias no trecho já inserido anteriormente!!!            
            // Aqui fazer as mudanças para bloquear certos campos pra evitar conflito!!!
            let tableHeader = ['Trecho1', 'trecho2', 'P.acumulado', 'vazao', 'velocidade', 'comprimento', 'comp.equivalente', 'Perda.Pressão', 'Dia.interno', 'Dia.externo', 'Press.minima', 'comp.virtual', 'Alt.geométrica', 'Press.Trechos', 'status', 'agua'];
            let virtual = new comprimentoVirtual(document.querySelector('#comprimentoReal').value, document.querySelector('#compTotal').value,);
            virtual = virtual.calcComprimentoVirtual();
            let pPressao = new perdaPressao(document.querySelector('#vazao').value, document.querySelector('#selectInterno').value, document.querySelector('#comprimentoReal').value,
                document.querySelector('#compTotal').value, document.querySelector('#agua').value);
            pPressao = pPressao.calcPerda();
            let ordem = 0;
            let pesoOriginal = 0;
            for (let indice = 0; indice < dataTable.length; indice++) {
                if (dataTable[indice].id == editRow) {
                    ordem = indice;
                    pesoOriginal = dataTable[indice].pesoOriginal;
                }
            }

            let data = {
                id: editRow, trecho1: document.querySelector('#montante').value, trecho2: document.querySelector('#jusante').value, peso: pesoOriginal, pesoOriginal: pesoOriginal,
                vazao: document.querySelector('#vazao').value, velocidade: document.querySelector('#speed').value, comprimento: document.querySelector('#comprimentoReal').value,
                comprimentoEquivalente: document.querySelector('#compTotal').value, perdaPressao: pPressao, dInterno: document.querySelector('#selectInterno').value, dExterno: document.querySelector('#selectExterno').value,
                pressaoMinima: document.querySelector('#pressaoMinima').value, comprimentoVirtual: virtual, alturaGeometrica: document.querySelector('#aGeometrica').value,
                pressaoTrechos: 7, status: 'aprovado', agua: document.querySelector('#agua').value
            };
            // dataTable.filter(row => { return row.id = editRow});            
            dataTable.splice(ordem, 1, data);

            // como para valores n primitivos (arrays e ebjetos se utiliza referencias precisamos vazer um clone de array ou obj)
            let calculatedTable = [...dataTable];
            // calcutingTable(calculatedTable);
            new CalculatingTable(calculatedTable);

            let indices = ['trecho1', 'trecho2', 'peso', 'vazao', 'velocidade', 'comprimento', 'comprimentoEquivalente', 'perdaPressao', 'dInterno', 'dExterno', 'pressaoMinima', 'comprimentoVirtual', 'alturaGeometrica',
                'pressaoTrechos', 'status', 'agua'];
            // let table = new fillTable(tableHeader, dataTable, indices);
            let table = new fillTable(tableHeader, calculatedTable, indices);
            table = table.buildTable();
            document.querySelector('#tableProject').innerHTML = '';
            await document.querySelector('#tableProject').appendChild(table);
            editTrecho();

            // apagando todos os valores inseridos            
            // document.querySelector('#selectInterno').value = '17';
            // document.querySelector('#selectExterno').value = '20';
            // ipcRenderer.send('resetVazaoPesoPressao');
            // ipcRenderer.send('sendingIDtoConexoes', { id: id });


            resetFields();
            verifiStatus();
            editRow = 'provision';
            ipcRenderer.send('rowEdit');
        }
    });
}
async function changingComp(idTrecho, newDiameter, comprimentoTable) {
    let conexoesTrechos = await ipcRenderer.invoke('getIDConexao');

    conexoesTrechos.forEach(trecho => {
        if (trecho.idTrecho == idTrecho) {
            let comprimentoTotal = 0;
            let doc = comprimentoTable.findOne({ 'ext': { '$eq': newDiameter } });
            trecho.dataConexoes.forEach(conexao => {
                comprimentoTotal += doc[conexao.name];
            });
            document.querySelector('#compTotal').value = comprimentoTotal.toFixed(2);
        }
    })

    ipcRenderer.send('correctDiameterConexao', { id: idTrecho, diameter: newDiameter });
}
async function readDB() {
    try {
        const data = await read(path.join(__dirname, '../../models/save/db.json'));
        db.loadJSON(data);

        return comprimentoTable = db.getCollection('comprimento-equivalente');
    } catch (err) {
        console.log(err.message);
    }
}
async function verifyPeca() {
    let pecas = await ipcRenderer.invoke('seekingPecas');
    if (pecas.length > 0) {
        if (editRow != 'provision' && editRow != null && editRow != null) {
            ipcRenderer.send('deletePecainTrecho', { idTrecho: editRow, peca: 'nenhuma', peso: '0', vazao: '0', pressaoMinima: '0' });
        }
    }
}
function verifiStatus() {
    document.querySelectorAll('.row').forEach(row => {
        if (row.children[14].innerHTML == 'Reprovado') {
            row.style.color = 'rgb(252, 73, 85)';
        }
    });
}
function getStartedTable() {
    let tableHeader = ['Trecho1', 'trecho2', 'P.acumulado', 'vazao', 'velocidade', 'comprimento', 'comp.equivalente', 'Perda.Pressão', 'Dia.interno', 'Dia.externo', 'Press.minima', 'comp.virtual', 'Alt.geométrica', 'Press.Trechos', 'status', 'agua'];
    // let table = new fillTable(tableHeader, dataTable, indices);
    let table = new fillTable(tableHeader, null, null);
    table = table.buildTable();
    document.querySelector('#tableProject').innerHTML = '';
    document.querySelector('#tableProject').appendChild(table);
}
function openInformation() {
    document.querySelector('#information').addEventListener('click', () => {
        if (edit) {
            ipcRenderer.send('openInformation', { id: editRow });
        }
    });
    document.querySelector('#project-information').addEventListener('click', () => {
        ipcRenderer.send('openInformationGeral', { data: dataTable });
    });
}
// function saveProject() {
//     document.querySelector('#save-project').addEventListener('click', () => {
//         alert('salvar projeto inteiro');
//     })
// }
function deleteTrecho() {
    document.querySelector('#delete-trecho').addEventListener('click', () => {
        if (editRow != 'provision') {
            let order = null;
            for (let i = 0; i < dataTable.length; i++) {
                if (dataTable[i].id == editRow) {
                    order = i;
                }
            }
            dataTable.splice(order, 1);
            let calculatedTable = [...dataTable];
            // calcutingTable(calculatedTable);
            new CalculatingTable(calculatedTable);

            let tableHeader = ['Trecho1', 'trecho2', 'P.acumulado', 'vazao', 'velocidade', 'comprimento', 'comp.equivalente', 'Perda.Pressão', 'Dia.interno', 'Dia.externo', 'Press.minima', 'comp.virtual', 'Alt.geométrica', 'Press.Trechos', 'status', 'agua'];
            let indices = ['trecho1', 'trecho2', 'peso', 'vazao', 'velocidade', 'comprimento', 'comprimentoEquivalente', 'perdaPressao', 'dInterno', 'dExterno', 'pressaoMinima', 'comprimentoVirtual', 'alturaGeometrica',
                'pressaoTrechos', 'status', 'agua'];
            // let table = new fillTable(tableHeader, dataTable, indices);
            let table = new fillTable(tableHeader, calculatedTable, indices);
            table = table.buildTable();
            document.querySelector('#tableProject').innerHTML = '';
            document.querySelector('#tableProject').appendChild(table);
            verifiStatus();
            editTrecho();

            resetFields();
            // ipcRenderer.send('resetVazaoPesoPressao');
            // ipcRenderer.send('sendingIDtoConexoes', { id: id });            
            ipcRenderer.send('deleteConxoesAndPecas', { id: editRow });
        }
    })
}
function resetFields() {
    ipcRenderer.send('resetVazaoPesoPressao');
    document.querySelector('#edit-project').classList.add('not-selected');
    document.querySelector('#information').classList.add('not-selected');
    document.querySelector('#add').classList.remove('not-selected');
    document.querySelector('#add').classList.add('add');
    document.querySelectorAll('.edit-blocked').forEach(el => {
        el.removeAttribute('disabled');
        el.classList.remove('not-selected');
    });
    document.querySelector('#delete-trecho').classList.add('not-selected');
    // editRow = 'provision';
    // ipcRenderer.send('rowEdit');

    let boxes = document.querySelectorAll('.needed');
    boxes.forEach(box => {
        box.value = '';
    });
    document.querySelector('#selectInterno').value = '17';
    document.querySelector('#selectExterno').value = '20';
}
function generatePDF() {

    // document.querySelector('#generatePDF').addEventListener('click', () => {
    // let path = null;
    // ipcRenderer.invoke('show-dialog').then(destination => { path = destination });

    // let rows = document.querySelectorAll('.row');
    // if (rows.length > 0) {
    //     let calculatedTable = [...dataTable];
    //     // calcutingTable(calculatedTable);
    //     new CalculatingTable(calculatedTable);
    //     console.log(calculatedTable);
    //     ipcRenderer.send('openTrechosPDF', { trechos: calculatedTable });

    //     let pdf = require('html-pdf');
    //     let ejs = require('ejs')
    //     // let fs = require('fs');
    //     // let html = fs.readFileSync('./public/infoProjectWindow/index.ejs', 'utf8');
    //     let options = { orientation: 'landscape', format: 'A1' };

    //     ejs.renderFile('./public/infoProjectWindow/trechospdf.ejs', { trechos: calculatedTable }, (err, html) => {
    //         if (err) {
    //             console.log(err);
    //         } else {

    //             pdf.create(html, { orientation: 'landscape' }).toFile('./pdfFolder/trechos.pdf', (err, res) => {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     console.log(res);
    //                 }
    //             })
    //         }
    //     });
    // }

    // ipcRenderer.send('openSavedWindow');
    // });
}
function saveProjectDB() {
    document.querySelector('#save-project').addEventListener('click', async () => {
        let calculatedTable = [...dataTable];
        // calcutingTable(calculatedTable);

        new CalculatingTable(calculatedTable);
        let id = await ipcRenderer.invoke('upLoadProject');
        ipcRenderer.send('save-project', { trechos: calculatedTable, upload: importedProject, id: id });
    })
}
function projectSaved() {
    ipcRenderer.on('sendProjectSaved', (e, projeto) => {
        dataTable = [];
        dataTable = [...projeto.trechos];
        let calculatedTable = [...dataTable];
        // calcutingTable(calculatedTable);
        new CalculatingTable(calculatedTable);
        let tableHeader = ['Trecho1', 'trecho2', 'P.acumulado', 'vazao', 'velocidade', 'comprimento', 'comp.equivalente', 'Perda.Pressão', 'Dia.interno', 'Dia.externo', 'Press.minima', 'comp.virtual', 'Alt.geométrica', 'Press.Trechos', 'status', 'agua'];
        let indices = ['trecho1', 'trecho2', 'peso', 'vazao', 'velocidade', 'comprimento', 'comprimentoEquivalente', 'perdaPressao', 'dInterno', 'dExterno', 'pressaoMinima', 'comprimentoVirtual', 'alturaGeometrica',
            'pressaoTrechos', 'status', 'agua'];
        // let table = new fillTable(tableHeader, dataTable, indices);
        let table = new fillTable(tableHeader, calculatedTable, indices);
        table = table.buildTable();
        document.querySelector('#tableProject').innerHTML = '';
        document.querySelector('#tableProject').appendChild(table);
        verifiStatus();
        editTrecho();

        importedProject = true;
        ipcRenderer.send('projectSavedToTrue');
    })

}