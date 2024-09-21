



class fillTable {

    // prim par = array de nome verdadeiro das colunas q será mostrado.
    // seg par = array de obj dos dados q preencherá a tabela.
    // array dos nomes dos índices dos objetos
    // ids se acaso queiramos marcar um id em cada linha da tabela.
    constructor(nameCollumns, data = null, nameIndice = null, ids = null) {
        this.nameCollumns = nameCollumns;
        this.data = data;
        this.nameIndice = nameIndice;
    }
    buildRow() {
        return document.createElement('tr');
    }
    buildCollumn() {
        return document.createElement('td');
    }
    buildTable() {
        this.table = document.createElement('table');
        this.row = this.buildRow();

        this.nameCollumns.forEach(name => {
            this.col = this.buildCollumn();
            this.col.classList.add('table-header');
            this.col.innerHTML = name;
            this.row.appendChild(this.col);
        });
        this.table.appendChild(this.row);

        if (this.data != null) {
            this.data.forEach(obj => {
                this.row = this.buildRow();
                this.row.classList.add('row');

                for (var indice of this.nameIndice) {
                    this.col = this.buildCollumn();
                    this.col.innerHTML = obj[indice];
                    this.col.setAttribute('classInput', indice);
                    this.row.appendChild(this.col);
                    this.row.id = (obj['id'] != null) ? obj['id'] : null;
                }
                this.table.appendChild(this.row);
            });
        }

        return this.table;

    }
}




module.exports = { fillTable }