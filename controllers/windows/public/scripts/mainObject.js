const { calcSpeed } = require('../../../../models/classes/calc');

let managingScreen = {
    // Creating trechos.
    creatingTrechos() {
        let position = '';
        document.querySelectorAll('.selectTrecho').forEach(selectTrecho => {
            position = (position === '') ? 'montante' : 'jusante';
            let select = document.createElement('select');
            select.id = position;
            select.classList.add('edit-blocked');
            for (let i = 1; i < 100; i++) {
                let option = document.createElement('option');
                option.innerHTML = i;
                select.appendChild(option);
            }
            selectTrecho.appendChild(select);
        });
    },
    managingWater() {
        // Managing agua 
        if (document.querySelector('#agua').value == 'Água Fria') {
            document.querySelector('#agua').style.backgroundColor = '#ccdefc';
        }
        document.querySelector('#agua').addEventListener('change', () => {
            if (document.querySelector('#agua').value == 'Água Fria') {
                document.querySelector('#agua').style.backgroundColor = '#ccdefc';
            } else {
                document.querySelector('#agua').style.backgroundColor = '#f7b0b8';
            }
        });
    },
    // Managing tubos
    managingPlubing(comprimentoTable, idTrecho) {
        let diametersInt = ['17', '21,6', '27,8', '35,2', '44', '53,4', '66,6', '75,6', '97,8'];
        let diametersExt = ['20', '25', '32', '40', '50', '60', '75', '85', '110'];

        let select = document.createElement('select');
        select.id = 'selectInterno';
        diametersInt.forEach(dia => {
            let option = document.createElement('option');
            option.innerHTML = dia;
            select.appendChild(option);
        });
        document.querySelector('#plubInt').appendChild(select);

        select = document.createElement('select');
        select.id = 'selectExterno';
        diametersExt.forEach(dia => {
            let option = document.createElement('option');
            option.innerHTML = dia;
            select.appendChild(option);
        });
        document.querySelector('#plubExt').appendChild(select);
        this.changingPlubing(diametersInt, diametersExt, comprimentoTable, idTrecho);
    },
    async changingPlubing(diametersInt, diametersExt) {
       
        // Ao mudar o select dos tubos        
        document.querySelector('#selectInterno').addEventListener('change', () => {
            let indice = diametersInt.indexOf(document.querySelector('#selectInterno').value);
            document.querySelector('#selectExterno').value = diametersExt[indice];
            let speed = new calcSpeed(document.querySelector('#selectInterno').value, document.querySelector('#vazao').value);
            document.querySelector('#speed').value = speed.speed;                       
        });
        document.querySelector('#selectExterno').addEventListener('change', () => {
            let indice = diametersExt.indexOf(document.querySelector('#selectExterno').value);
            document.querySelector('#selectInterno').value = diametersInt[indice];
            let speed = new calcSpeed(document.querySelector('#selectInterno').value, document.querySelector('#vazao').value);
            document.querySelector('#speed').value = speed.speed;
        });
    },    
    clickButtons() {
        document.querySelector('#utilization').addEventListener('click', (e) => {
            e.target.style.backgroundImage = 'linear-gradient(to bottom right,rgba(224, 224, 224,0.6),rgba(150, 150, 150,1))';
            document.querySelector('#nUtilization').style.backgroundImage = 'linear-gradient(to bottom right,rgba(224, 224, 224,0.6),rgba(224, 224, 224,1))'
        })
        document.querySelector('#nUtilization').addEventListener('click', (e) => {
            e.target.style.backgroundImage = 'linear-gradient(to bottom right,rgba(224, 224, 224,0.6),rgba(150, 150, 150,1))';
            document.querySelector('#utilization').style.backgroundImage = 'linear-gradient(to bottom right,rgba(224, 224, 224,0.6),rgba(224, 224, 224,1))'
        })
        // background-image:linear-gradient(to bottom right,rgba(224, 224, 224,0.6),rgba(224, 224, 224,1));
    }
}

module.exports = { managingScreen };
