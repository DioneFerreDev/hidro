const path = require('path');
const loki = require('lokijs');
const read = require('read-file-utf8');
const { fillTable } = require('../../models/classes/fillTable');
const { ipcRenderer, contextBridge } = require('electron');
selectedProjeto = null;
let id = null;


document.addEventListener('DOMContentLoaded', () => {
    initializeData();
});


async function initializeData() {
    // const db = new loki('./models/save/project.json', { autoload: true, autoloadCallback: loadHandler, autosave: true });
    const db = new loki('./models/save/project.json');
    // como acabou de pegar a collection projetoTrechos, usar seus dados para preencher as tabelas
    const data = await read(path.join(__dirname, '../../models/save/project.json'));
    db.loadJSON(data);
    let collection = db.getCollection('projetoTrechos');
    let projetos = collection;
    collection = collection.chain().find({ id: { '$ne': null } }).simplesort('projeto');
    collection = collection.data();

    async function loadHandler() {
        let collection = db.getCollection('projetoTrechos');
        colletion = collection.data;
        if (collection === null) {
            collection = db.addCollection('projetoTrechos');
        }
    }
    feedingTable(collection);

    // Selectionando o projeto ao clicar na tabela.
    document.querySelectorAll('.row').forEach(row => {
        row.addEventListener('click', async () => {
            let projeto = row.children[0].innerHTML;
            id = Number(row.id);

            document.querySelector('#selectProject').style.display = 'block';
            document.querySelector('#deleteProject').style.display = 'block';
            document.querySelector('#projectName').value = projeto;
            selectedProjeto = await projetos.findOne({ $loki: id });
        });
    });

    chooseProject();
    // deleteProject();

    document.querySelector('#deleteProject').addEventListener('click', async () => {
        const query = " Deseja Realmente deletar esse Projeto? Uma vez deletado este não constará mais no Banco de dados!";
        if (confirm(query)) {
            let doc = projetos.findOne({ $loki: id });
            let ok = projetos.remove(doc);
            if (ok) {
                db.saveDatabase();
                collection = db.getCollection('projetoTrechos');
                collection = collection.chain().find({ id: { '$ne': null } }).simplesort('projeto');
                collection = collection.data();
                feedingTable(collection);
                alert("Projeto Deletado com Sucesso!!!");
            } else {
                alert("Ouve um erro ao deletar o Projeto!!!");
            }
        }

        document.querySelector('#selectProject').style.display = 'none';
        document.querySelector('#deleteProject').style.display = 'none';
    })
}
function feedingTable(collection) {
    document.querySelector('#projectTable').innerHTML = '';

    let novaCollection = collection.map(colle => ({ nome: colle.projeto, id: colle.$loki }));
    let header = ['Projeto'];
    let ids = ['nome']
    let table = new fillTable(header, novaCollection, ids);
    table = table.buildTable();

    document.querySelector('#projectTable').appendChild(table);
}
function chooseProject() {
    document.querySelector('#selectProject').addEventListener('click', (e) => {
        if (document.querySelector('#projectName').value != '' && document.querySelector('#projectName').value != false) {
            let projeto = { trechos: selectedProjeto.trechos, pecas: selectedProjeto.pecas, conexoes: selectedProjeto.conexoes }
            ipcRenderer.send('useProjectSaved', { projeto: projeto, id: id });
            console.log(projeto);
            e.target.style.display = 'none';
            document.querySelector('#deleteProject').style.display = 'none';
        } else {
            alert('É necessário selecionar o projeto primeiro!!!');
        }
    });
}
function deleteProject() {
    document.querySelector('#deleteProject').addEventListener('click', () => {
        const query = " Deseja Realmente deletar esse Projeto? Uma vez deletado este não constará mais no Banco de dados!";
        if (confirm(query)) {
            alert('Confirmado, deletar Projeto !!!');
        } else {
            alert('Negado, não deletar Projeto!!!');
        }
    })
}