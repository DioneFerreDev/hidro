class calcLitros {
    constructor(pesos) {
        this.litros = 0.3 * Math.sqrt(Number(pesos));
    }
    sendLitros() {
        return this.litros;
    }
}
class calcDiametro extends calcLitros {
    constructor(pesos, velocidade) {
        super(pesos);
        this.velocidade = velocidade;
    }
    sendDiametro() {
        this.diametro = 2000 * Math.sqrt((this.litros * Math.pow(10, -3)) / (this.velocidade * Math.PI));
        return this.diametro;
    }
}
class calcDiametrosPadroes {
    constructor(diameter) {
        this.diameter = Number(diameter);
        this.diametersInt = [17, 21.6, 27.8, 35.2, 44, 53.4, 66.6, 75.6, 97.8];
        this.diametersExt = [20, 25, 32, 40, 50, 60, 75, 85, 110];

        for (let i = 0; i < this.diametersInt.length; i++) {
            if (this.diametersInt[i] > this.diameter && this.diametersInt[i] == 17) {
                document.querySelector('#selectInterno').value = this.diametersInt[i].toString().replace('.', ',');
                document.querySelector('#selectExterno').value = this.diametersExt[i].toString().replace('.', ',');
            } else if (this.diametersInt[i] > this.diameter && this.diametersInt[i - 1] < this.diameter) {
                document.querySelector('#selectInterno').value = this.diametersInt[i].toString().replace('.', ',');
                document.querySelector('#selectExterno').value = this.diametersExt[i].toString().replace('.', ',');
            }
        }
    }
}
class calcSpeed {
    constructor(diameter, vazao) {
        this.diameter = Number(diameter.replace(',', '.'));
        this.vazao = Number(vazao);
        this.vazao = this.vazao * Math.pow(10, -3);
        this.area = Math.pow(this.diameter * Math.pow(10, -3) / 2, 2) * Math.PI;
        this.speed = this.vazao / this.area
        this.speed = this.speed.toFixed(2);
        return this.speed;
    }
}
class comprimentoVirtual {
    constructor(comprimento, comprimentoEquivalente) {
        this.comprimento = Number(comprimento);
        this.comprimentoEquivalente = Number(comprimentoEquivalente);
    }
    calcComprimentoVirtual() {
        let virtual = this.comprimento + this.comprimentoEquivalente;
        return virtual;
    }
}
class perdaPressao extends comprimentoVirtual {

    constructor(vazao, diametro, comprimento, comprimentoEquivalente, agua) {
        super(comprimento, comprimentoEquivalente);
        this.agua = agua;
        this.vazao = Number(vazao);
        this.diametro = diametro;
        this.diametro = this.diametro.toString().replace(',', '.');
        this.diametro = Number(this.diametro);
        this.comprimentoVirtual = this.calcComprimentoVirtual();
    }
    calcPerda() {
        let perda = null;
        if (this.agua == 'Água Fria') {
            perda = 8.69 * Math.pow(10, 6) * Math.pow(this.vazao, 1.75) * Math.pow(this.diametro, -4.75) * this.comprimentoVirtual * 0.1;
        } else {
            perda = 20.2 * Math.pow(10, 6) * Math.pow(this.vazao, 1.88) * Math.pow(this.diametro, -4.88) * this.comprimentoVirtual * 0.1;
        }
        return perda.toFixed(3);
    }
}
class CalculatingTable {

    constructor(rows) {
        this.rows = rows;
        this.trechoInserido = this.rows[this.rows.length - 1];
        this.peso = Number(this.trechoInserido.pesoOriginal);
        this.montante = this.trechoInserido.trecho1;
        this.jusante = this.trechoInserido.trecho2;
        this.ok = true;
        this.calcTable();
    }
    calcPressaoTrecho(rows) {
        rows.forEach(row => {
            let ok = true;
            let montante = row.trecho1;
            let pressaoAcumulada = Number(row.perdaPressao);

            while (ok == true) {
                ok = false;
                let trecho = rows.filter(roww => { return roww.trecho2 == montante });
                if (trecho.length == 1) {
                    pressaoAcumulada += Number(trecho[0].perdaPressao);
                    montante = trecho[0].trecho1;
                    ok = true;
                }

            }
            row.pressaoTrechos = Number(row.alturaGeometrica) - Number(pressaoAcumulada);
            row.pressaoTrechos = row.pressaoTrechos.toFixed(3);
            let speed = new calcSpeed(row.dInterno, row.vazao);
            row.velocidade = speed.speed;
            if (Number(row.pressaoMinima) > Number(row.pressaoTrechos) || Number(row.velocidade) > 3) {
                row.status = "Reprovado";
            } else {
                row.status = "Aprovado";
            }
        });
        return rows;
    }
    calcTable() {
        this.rows.forEach(row => { row.peso = Number(row.pesoOriginal) });
        this.rows.forEach(row => {
            // verificar se há trechos ligados a jusante caso haja adicionar peso a eles
            let montante = row.trecho1;
            let addPeso = Number(row.pesoOriginal);

            let ok = true;
            while (ok == true) {
                ok = false;
                let trechoJusante = this.rows.filter(row => { return row.trecho2 == montante });

                //verificar se existe trecho a jusante
                if (trechoJusante.length == 1) {
                    ok = true;
                    let idJusante = trechoJusante[0].id;
                    montante = trechoJusante[0].trecho1;

                    for (let i = 0; i < this.rows.length; i++) {
                        if (this.rows[i].id == idJusante) {
                            let peso = Number(this.rows[i].peso);
                            this.rows[i].peso = peso + addPeso;
                            this.rows[i].peso = this.rows[i].peso.toFixed(2);
                            this.rows[i] = this.calcRow(this.rows[i]);
                        }
                    }
                }
            }
            row = this.calcRow(row);
        });
        this.rows = this.calcPressaoTrecho(this.rows);
        return this.rows;
    }
    calcRow(row) {
        //Calcular vazao e perda de pressao nos trechos.
        let vazao = 0.3 * Math.sqrt(row.peso);
        let perdPressao = new perdaPressao(vazao, row.dInterno, row.comprimento, row.comprimentoEquivalente, row.agua);
        perdPressao = perdPressao.calcPerda();
        perdPressao = parseFloat(perdPressao).toFixed(3);
        row.perdaPressao = perdPressao;
        row.vazao = vazao.toFixed(2);
        return row;
    }
}






module.exports = { calcLitros, calcDiametro, calcDiametrosPadroes, calcSpeed, perdaPressao, comprimentoVirtual, CalculatingTable }