class acceptValue {

    // prim par array de linhas da tabela.
    // seg par array dos ids dos objetos q serão inserido os valores
    constructor(rows,ids) {
        this.rows = rows;
        this.ids = ids;
    }
    transferValues() {
        this.rows.forEach(row => {
            row.addEventListener('click', () => {
                document.querySelector('#add').style.display = 'block';
                this.amountChildren = row.childElementCount;                                
                for (this.indice = 0; this.indice < this.amountChildren; this.indice++) {
                    let classInput = row.children[this.indice];                    
                    this.ids.forEach(id => {
                        let classId= '#'+classInput.getAttribute('classinput');
                        if(id == classId){
                            if(document.querySelector(id))
                                document.querySelector(id).value = row.children[this.indice].innerHTML;                                                                                                      
                        }
                    });                    
                }                
            });
        });
    }
}


module.exports = { acceptValue };