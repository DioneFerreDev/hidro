const { ipcRenderer } = require('electron');
const loki = require('lokijs');
const path = require('path');

document.addEventListener('DOMContentLoaded', () => {
    initializeSaving();
});


async function initializeSaving() {
    let trechos = null;
    let conexoes = null;
    let pecas = null;
    let upload = false;
    let id = 0;
    const db = new loki(path.join(__dirname, '../../models/save/project.json'), { autoload: true, autoloadCallback: loadHandler, autosave: true });
    let projeto = null;

    // let obj = await renderer();
    ipcRenderer.on('send-trechos', async (e, data) => {
        trechos = await data.trechos;
        conexoes = await data.conexoes;
        pecas = await data.pecas;
        upload = await data.upload;
        id = await Number(data.id);
        if (upload) {
            let attr = document.createAttribute('disabled');
            document.querySelector('#name-project').setAttributeNode(attr);
            document.querySelector('#name-project').value = 'Atualizar projeto !!!';
        }
    });

    document.querySelector('#save-project').addEventListener('click', (e) => {
        e.preventDefault();
        if (!upload) {
            projeto = document.querySelector('#name-project').value;
            let projetoTrechos = db.addCollection('projetoTrechos');
            if (projeto != '' && projeto != null) {
                let oldProject = projetoTrechos.find({ projeto: projeto });

                if (oldProject.length == 0) {
                    projeto = { projeto: projeto, trechos: trechos, conexoes: conexoes, pecas: pecas };
                    projetoTrechos.insert([projeto]);
                    db.saveDatabase(err => {
                        if (err) {
                            console.log(err);
                        } else {
                            let attr = document.createAttribute('disabled');
                            alert('Projeto Salvo com Sucesso!!!');
                            document.querySelector('#name-project').value = '';
                            document.querySelector('#name-project').setAttributeNode(attr);
                            document.querySelector('#save-project').style.display = 'none';
                        }
                    });
                } else {
                    alert('Este nome de projeto já existe!!');
                }
            } else {
                alert('É necessário inserir um nome de Projeto');
            }
        } else {
            // let oldProject = projetoTrechos.find({ projeto: projeto });
            let projetoTrechos = db.addCollection('projetoTrechos');
            projetoTrechos.findAndUpdate({ $loki: id }, doc => {
                doc.trechos = trechos;
                doc.pecas = pecas;
                doc.conexoes.dataConexoes = conexoes;
            });
            alert('Projeto atualizado com Sucesso!!!');
        }

    });
    function loadHandler() {
        let collection = db.getCollection('projetoTrechos');
        if (collection === null) {
            collection = db.addCollection('projetoTrechos');
        }
    }
}
// function renderer(){
//     ipcRenderer.on('send-trechos', async (e, data) => {
//         let trechos = await data.trechos;
//         let conexoes = await data.conexoes;
//         let pecas = await data.pecas;
//         let upload = await data.upload;
//         let id = Number(data.id);

//         return {trechos: trechos, conexoes: conexoes, pecas: pecas, upload: upload, id: id}

//     });
// }

