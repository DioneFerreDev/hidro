const loki = require('lokijs');
const read = require('read-file-utf8');
const path = require('path');
const db = new loki(path.join(__dirname, '../../models/save/db.json'));
const { fillTable } = require('../../models/classes/fillTable');
const { ipcRenderer } = require('electron');
let conexoes = [];
let ids = [];

document.addEventListener('DOMContentLoaded', () => {
    readDB();
    totalComp();

});
async function readDB() {
    try {
        const data = await read(path.join(__dirname, '..//../models/save/db.json'));
        db.loadJSON(data);
        const comprimento = db.getCollection('comprimento-equivalente');

        // Pegando o diametro na tela principal
        let diameter = await ipcRenderer.invoke('getDia');
        conexSelected(comprimento, diameter);

    } catch (err) {
        console.log(err.message);
    }
}
async function conexSelected(comprimento, diameter) {
    //verificando se já existe as conexoes
    let conexoesTrechos = await ipcRenderer.invoke('getIDConexao');
    idEdit = await ipcRenderer.invoke('getIdEdit');

    // verificar se pertence ao mesmo trecho.
    conexoes = null;
    if (conexoesTrechos.length > 0) {
        document.querySelector('#add').style.display = 'none';
        if (conexoesTrechos[conexoesTrechos.length - 1].idTrecho == 'provision') {
            let trecho = conexoesTrechos[conexoesTrechos.length - 1];
            trecho = trecho.dataConexoes;

            conexoes = trecho.map((conexao) => {
                let doc = comprimento.findOne({ 'ext': { '$eq': diameter } });
                let comprimentoEquivalente = doc[conexao.name];
                ids.push(conexao.trueName);
                return { 'name': conexao.trueName, 'comprimento': comprimentoEquivalente, 'id': conexao.name };
            });
        }
        if (idEdit != null && idEdit != 'undefined') {
            //            
            let trecho = null;
            conexoesTrechos.forEach(trechoConex => {
                if (trechoConex.idTrecho == idEdit) {
                    trecho = trechoConex;
                }
            });
            trecho = trecho.dataConexoes;

            conexoes = trecho.map((conexao) => {
                let doc = comprimento.findOne({ 'ext': { '$eq': diameter } });
                let comprimentoEquivalente = doc[conexao.name];
                ids.push(conexao.trueName);
                return { 'name': conexao.trueName, 'comprimento': comprimentoEquivalente, 'id': conexao.name };
            });
            //
        }
    }
    playTable(diameter, comprimento, conexoes);
}
function playTable(diameter, comprimento, data = null) {
    // ao clicar no Painel
    let conexoes = [];
    if (data == null) {
        document.querySelector('#add').style.display = 'block';
        document.querySelectorAll('.btn-panel').forEach(panel => {
            panel.addEventListener('click', (e) => {
                let el = e.target;
                let namePeca = el.getAttribute('name');
                let trueName = el.getAttribute('trueName');

                // procurando na tabela comprimento a conexao selecionada
                let doc = comprimento.findOne({ 'ext': { '$eq': diameter } });
                let comprimentoEquivalente = doc[namePeca];

                let conexao = { 'name': trueName, 'comprimento': comprimentoEquivalente, 'id': namePeca };
                conexoes.push(conexao);
                ids.push(namePeca);

                // Criando a tabela.                
                creatingTable(['Conexão', 'Comprimento'], conexoes, ['name', 'comprimento'], ids);
            });
        });
    } else {
        creatingTable(['Conexão', 'Comprimento'], data, ['name', 'comprimento'], ids);

        document.querySelectorAll('.btn-panel').forEach(panel => {
            panel.addEventListener('click', (e) => {
                document.querySelector('#add').style.display = 'block';
                let el = e.target;
                let namePeca = el.getAttribute('name');
                let trueName = el.getAttribute('trueName');

                // procurando na tabela comprimento a conexao selecionada
                let doc = comprimento.findOne({ 'ext': { '$eq': diameter } });
                let comprimentoEquivalente = doc[namePeca];

                let conexao = { 'name': trueName, 'comprimento': comprimentoEquivalente, 'id': namePeca };
                data.push(conexao);
                ids.push(namePeca);

                // Criando a tabela.                
                creatingTable(['Conexão', 'Comprimento'], data, ['name', 'comprimento'], ids);
            });
        });
    }

}
function clickTable() {
    let peca = null;
    document.querySelectorAll('.row').forEach(row => {
        row.addEventListener('click', () => {
            //Pegando as informações da linha da tabela
            let rowChildrens = row.children;
            peca = rowChildrens[0].innerHTML;
            console.log('nome é ' + peca);
            console.log('pecas pra ver se deleta é')
            conexoes.forEach(conexao => { console.log(conexao); });

            // Abilitando btn deletar
            document.querySelector('#deleteBtn').style.display = 'block';

            // Ao clicar no btn delete deletar.
            document.querySelector('#deleteBtn').addEventListener('click', async () => {

                conexoes = await conexoes.filter(conexao => {
                    if (conexao.name != peca) {
                        return conexao.name != peca
                    } else {
                        // Voltando a cor original do painel.
                        conexoes.forEach(conexao => {
                            if (conexao.name == peca) {
                                let name = conexao.id;
                                document.querySelector("#" + name).style.backgroundColor = "#dfe3eb";
                            }
                        });
                        peca = null;
                    }
                });

                //Aparecendo o btn para confirmarmos.
                document.querySelector('#add').style.display = 'block';
                peca = null;
                creatingTable(['Conexão', 'Comprimento'], conexoes, ['name', 'comprimento']);
                document.querySelector('#deleteBtn').style.display = 'none';
                efectPanel(conexoes);
            });
        })
    });
};
function creatingTable(headerName, conexoes, indices, ids) {
    let table = new fillTable(headerName, conexoes, indices, ids);
    table = table.buildTable();
    document.querySelector('#wrap-table').innerHTML = '';
    document.querySelector('#wrap-table').appendChild(table);
    clickTable();
    efectPanel(conexoes);
};
function efectPanel(conexoes = null) {
    let panels = document.querySelectorAll('.btn-panel');
    panels.forEach(panel => {
        let name = panel.getAttribute('name');

        conexoes.forEach(conexao => {
            if (conexao.id == name) {
                document.querySelector('#' + name).style.backgroundColor = '#8fb6f7';
            }
        })
    })
}
async function totalComp() {
    let conexoesTrechos = await ipcRenderer.invoke('getIDConexao');
    document.querySelector('#add').addEventListener('click', async (e) => {
        if (conexoesTrechos.length > 0) {
            if (conexoesTrechos[conexoesTrechos.length - 1].idTrecho == 'provision') {
                ipcRenderer.send('deleteLastConexoesProvision');
            }
        }
        let trecho = {};
        if (idEdit != null && idEdit != 'undefined') {
            ipcRenderer.send('deleteTrechoConexaoEdit', { id: idEdit });
            trecho.idTrecho = idEdit;
            trecho.dataConexoes = [];
        } else {
            trecho.idTrecho = 'provision';
            trecho.dataConexoes = [];
        }
        let diameter = await ipcRenderer.invoke('getDia');
        let rows = document.querySelectorAll('.row');
        let comp = 0;

        let conexao = null;

        rows.forEach(row => {
            comp += Number(row.children[1].innerHTML);

            let name = row.id;
            let trueName = row.children[0].innerHTML;
            conexao = { name: name, diameter: diameter, trueName: trueName };
            trecho.dataConexoes.push(conexao);
        });

        ipcRenderer.send('sendComp', { comprimentoEquivalente: comp, conexao: trecho });
        e.target.style.display = 'none';

    })
}
