const { ipcRenderer } = require('electron');
const { fillTable } = require('../../models/classes/fillTable');


document.addEventListener('DOMContentLoaded', async () => {
    playInformation();
});

async function playInformation(){
    let idInformation = await ipcRenderer.invoke('getIdInformation');
    let conexoes = await ipcRenderer.invoke('getIDConexao');
    let pecaUtilization = await ipcRenderer.invoke('pecaUtilization');
    let dataConexoes = [];
    let ids = [];
    let pecaName = null;
    console.log(conexoes);
    console.log(pecaUtilization);

    pecaUtilization.forEach(peca => {
        if (peca.idTrecho == idInformation){
            pecaName = peca.peca;
            return
        }
    });
    conexoes.forEach(conexao => {
        if (conexao.idTrecho == idInformation) {
            dataConexoes = conexao.dataConexoes;
            conexao.dataConexoes.forEach(peca => {
                peca.trueName;
            });
        }
    });

    if(pecaName != null){
        document.querySelector('#pecaName').value = pecaName;
    }

    let table = new fillTable(['Peça', 'Diametro'], dataConexoes, ['name', 'diameter'], ids);
    table = table.buildTable();
    document.querySelector('#wrap-table').innerHTML = '';
    document.querySelector('#wrap-table').appendChild(table);
}