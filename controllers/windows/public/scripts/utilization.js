const loki = require('lokijs');
const read = require('read-file-utf8');
const path = require('path');
const db = new loki(path.join(__dirname, '/../../models/save/db.json'));
const { fillTable } = require('../../../../models/classes/fillTable');
const { acceptValue } = require('../../../../models/classes/acceptValue');
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    readDB();
});


async function readDB() {
    try {
        const data = await read(path.join(__dirname, '../../models/save/db.json'));
        db.loadJSON(data);
        const utilization = db.getCollection('utilization');

        let table = new fillTable(['Peças de utilização', 'vazão', 'Peso relativo', 'Pressão mínima'], utilization.data, ['pecas', 'vazao', 'pesoRelativo', 'pressaoMinima']);
        table = table.buildTable();

        await document.querySelector('#wrap-table').appendChild(table);
        const rows = document.querySelectorAll('.row');
        const ids = ['#pecas', '#vazao', '#pesoRelativo', '#pressaoMinima'];
        let values = new acceptValue(rows, ids);
        values.transferValues();

        let pecaUtilization = await ipcRenderer.invoke('verifyLastidTrecho');
        if (pecaUtilization.ok) {

            document.querySelector('#pesoRelativo').value = pecaUtilization.peso;
            document.querySelector('#vazao').value = pecaUtilization.vazao;
            document.querySelector('#pressaoMinima').value = pecaUtilization.pressaoMinima;
            document.querySelector('#pecas').value = pecaUtilization.name;

            document.querySelector('#add').style.display = 'block';
        }
        addPeca();

    } catch (err) {
        console.log(err.message);
    }
}
function addPeca() {
    document.querySelector('#add').addEventListener('click', async (e) => {
        let editRow = await ipcRenderer.invoke('getIdEditUtilization');
        let pesoRelativo = document.querySelector('#pesoRelativo').value;
        let vazao = document.querySelector('#vazao').value;
        let pressao = document.querySelector('#pressaoMinima').value;
        let peca = document.querySelector('#pecas').value;

        if (editRow == 'provision') {
            ipcRenderer.send('closeUtilization', { idTrecho: 'provision', namePeca: peca, peso: pesoRelativo, vazao: vazao, pressaoMinima: pressao });
        } else {
            ipcRenderer.send('upDatingUtilization', { idTrecho: editRow, namePeca: peca, peso: pesoRelativo, vazao: vazao, pressaoMinima: pressao });
        }



        // escondendo o button de adicionar.
        e.target.style.display = 'none';

    });
}
