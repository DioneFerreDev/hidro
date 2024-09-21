const { ipcRenderer } = require('electron');
const { fillTable } = require('../../models/classes/fillTable');
let pecasPDF = null;
let conexoesPDF = null;
let tubulacoesPDF = null;

document.addEventListener('DOMContentLoaded', () => {
    playGeneralInformation();
    generatePDF();
});

async function playGeneralInformation() {
    let project = await ipcRenderer.invoke('getProjectData');

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
            plubingTotal.push({ plub: diaPlub, comprimento: comprimento });
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
    document.querySelector('#pdf').addEventListener('click', () => {
        // ipcRenderer.send('projectInformationPDF', { pecas: pecasPDF, conexoes: conexoesPDF, tubulacoes: tubulacoesPDF });
        let pdf = require('html-pdf');
        let fs = require('fs');
        let html = fs.readFileSync('./public/infoProjectWindow/index.ejs', 'utf8');
        let options = { format: 'Letter' };        
    

        alert('mandou');
        pdf.create(html, options).toFile('./pdfFolder/projectInformation2.pdf', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        })
    });
}