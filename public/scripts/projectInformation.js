const { ipcRenderer } = require('electron');
const pathh = require('path');
const { fillTable } = require('../../models/classes/fillTable');
let pecasPDF = null;
let conexoesPDF = null;
let tubulacoesPDF = null;
let path = null;

document.addEventListener('DOMContentLoaded', () => {
    playGeneralInformation();
    loadPath();
    generatePDF();
});

async function playGeneralInformation() {
    let project = await ipcRenderer.invoke('getProjectData');

    ipcRenderer.on('send-destination', (e, destination) => {
        document.querySelector('#file-path').value = destination;
    })

    //Calculando Peças
    let pecas = project.pecas;
    let amount = null;
    let pecasTotal = [];
    let pecasInserted = [];
    pecas.forEach(name => {
        let namePeca = name.peca;
        let ok = pecasInserted.filter(peca => { return peca == namePeca });
        if (ok.length == 0) {
            amount = pecas.filter(name => { return name.peca == namePeca });
            amount = amount.length;
            pecasTotal.push({ peca: namePeca, quantidade: amount });
            pecasInserted.push(namePeca);
        }
    });
    console.log(pecasTotal);
    pecasPDF = pecasTotal;
    let tablePecas = new fillTable(['Peça', 'Quantidade'], pecasTotal, ['peca', 'quantidade']);
    tablePecas = tablePecas.buildTable();
    document.querySelector('#wrap-table-pecas').appendChild(tablePecas);


    //Calculando Conexões
    let conexoes = project.conexoes;
    let newConexoes = [];
    conexoes.forEach(conexao => {
        conexao.dataConexoes.forEach(conex => { newConexoes.push(conex) });
    });

    let conexoesTotal = [];
    let conexoesInserted = [];
    newConexoes.forEach(conexao => {
        let nameConex = conexao.trueName;
        let diameter = conexao.diameter;
        let ok = conexoesInserted.filter(conex => { return conex.conexao == nameConex && conex.diametro == diameter });
        if (ok.length == 0) {
            amount = newConexoes.filter(conex => { return conex.trueName == nameConex && conex.diameter == diameter });
            amount = amount.length;
            conexoesTotal.push({ conexao: nameConex, diametro: diameter, quantidade: amount });
            conexoesInserted.push({ conexao: nameConex, diametro: diameter });
        }
    });

    conexoesPDF = conexoesTotal;
    console.log(conexoesPDF);
    let tableConexoes = new fillTable(['Conexao', 'Diametro (mm)', 'Quantidade'], conexoesTotal, ['conexao', 'diametro', 'quantidade']);
    tableConexoes = tableConexoes.buildTable();
    document.querySelector('#wrap-table-conexoes').appendChild(tableConexoes);


    //Calculando Tubulações
    let plubing = project.trechos;
    let plubingTotal = [];
    let plubsInserted = [];
    plubing.forEach(plub => {
        let diaPlub = plub.dExterno;
        // let comprimento = plub.comprimento;
        let comprimento = 0;
        let ok = plubsInserted.filter(plub => { return plub.dExterno == diaPlub });
        // amount = 0;
        if (ok.length == 0) {
            // amount = plubing.filter(plub => { return plub.dExterno == diaPlub });
            // amount = amount.length; 
            for (tubo of plubing) {
                if (tubo.dExterno == diaPlub) {
                    comprimento += Number(tubo.comprimento);
                }
            }
            plubingTotal.push({ plub: diaPlub, comprimento: comprimento.toFixed(2) });
            plubsInserted.push({ dExterno: diaPlub });
        }
    });

    tubulacoesPDF = plubingTotal;
    console.log(tubulacoesPDF);
    let tablePlubing = new fillTable(['Diametro (mm)', 'comprimento (m)'], plubingTotal, ['plub', 'comprimento']);
    tablePlubing = tablePlubing.buildTable();
    document.querySelector('#wrap-table-plubing').appendChild(tablePlubing);
}
function generatePDF() {
    document.querySelector('#pdf').addEventListener('click', async () => {

        let fileName = document.querySelector('#file-name').value;
        if (fileName != '' && fileName != null && document.querySelector('#file-path').value != '' && document.querySelector('#file-path').value != null) {
            path = document.querySelector('#file-path').value;            
            // ipcRenderer.send('projectInformationPDF', { pecas: pecasPDF, conexoes: conexoesPDF, tubulacoes: tubulacoesPDF });
            let pdf = require('html-pdf');
            let ejs = require('ejs')
            let fs = require('fs');
            // let html = fs.readFileSync('./public/infoProjectWindow/index.ejs', 'utf8');
            // let options = { format: 'Letter' };        

            ejs.renderFile(pathh.join(__dirname,'../../public/infoProjectWindow/index.ejs'), { pecas: pecasPDF, conexoes: conexoesPDF, tubulacoes: tubulacoesPDF }, (err, html) => {
                console.log(path);
                if (err) {
                    console.log(err);
                } else {

                    pdf.create(html, {}).toFile(path + '/' + fileName + '.pdf', (err, res) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                            alert('PDF gerado com Sucesso!!!');
                        }
                    })
                }
            });
        } else {
            alert('Nome do arquivo não especificado ou destino não especificado!!!');
        }
    });
}
async function carregar() {
    const ejs = require('ejs');
    let valores = await ipcRenderer.invoke('getInformationPDF');
}
function loadPath(){
    document.querySelector('#choose').addEventListener('click', async () => {
        path = await ipcRenderer.invoke('show-dialog');
        document.querySelector('#file-path').value = path
    })
}