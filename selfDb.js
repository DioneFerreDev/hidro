const loki = require('lokijs');


// criando manualmente nossa base de dados
const db = new loki('./models/save/db.json');
var comprimentoEquivalente = db.addCollection('comprimento-equivalente');
var utilization = db.addCollection('utilization');
utilization.insert([{
    pecas:'Bacia sanitária caixa de descarga',
    vazao:0.15,
    pesoRelativo:0.3,
    pressaoMinima:0.5
},
{
    pecas:'Bacia sanitária válvula de descarga',
    vazao:1.7,
    pesoRelativo:32,
    pressaoMinima:1.5 
},
{
    pecas:'Banheira misturador (água fria)',
    vazao:0.3,
    pesoRelativo:1,
    pressaoMinima:1 
},
{
    pecas:'Bebedouro registro de pressão',
    vazao:0.1,
    pesoRelativo:0.1,
    pressaoMinima:1 
},
{
    pecas:'Bidê misturador (água fria)',
    vazao:0.1,
    pesoRelativo:0.1,
    pressaoMinima:1 
},
{
    pecas:'Chuveiro ou ducha misturador (água fria)',
    vazao:0.2,
    pesoRelativo:0.4,
    pressaoMinima:1 
},
{
    pecas:'Chuveiro elétrico registro de pressão',
    vazao:0.1,
    pesoRelativo:0.1,
    pressaoMinima:1 
},
{
    pecas:'Lavadora de pratos ou de roupa registro de pressão',
    vazao:0.3,
    pesoRelativo:1,
    pressaoMinima:1 
},
{
    pecas:'Lavatório torneira ou misturador (água fria)',
    vazao:0.15,
    pesoRelativo:0.3,
    pressaoMinima:1 
},
{
    pecas:'Mictório cerâmico com sifão integrado válvula de descarga',
    vazao:0.5,
    pesoRelativo:2.8,
    pressaoMinima:1 
},
{
    pecas:'Mictório cerâmico sem cifão integrado caixa de descarga, registro de pressão ou válvula de descarga',
    vazao:0.15,
    pesoRelativo:0.3,
    pressaoMinima:1 
},
{
    pecas:'Pía torneira ou misturador (água fria)',
    vazao:0.25,
    pesoRelativo:0.7,
    pressaoMinima:1 
},
{
    pecas:'Pía torneira elétrica',
    vazao:0.1,
    pesoRelativo:0.1,
    pressaoMinima:1 
},
{
    pecas:'Tanque torneira',
    vazao:0.25,
    pesoRelativo:0.7,
    pressaoMinima:1 
},
{
    pecas:'Torneira de jardin lavagem em geral',
    vazao:0.2,
    pesoRelativo:0.4,
    pressaoMinima:1 
}]
);
comprimentoEquivalente.insert([
    {
        int: '17',
        ext: '20',
        joelho90: 1.1,
        joelho45: 0.4,
        curva90: 0.4,
        curva45: 0.2,
        T90Direta: 0.7,
        T90Lado: 2.3,
        T90Bilateral: 2.3,
        entradaNormal: 0.3,
        entradaBorda: 0.9,
        saidaCanal: 0.8,
        valvuladePeEcrivo: 8.1,
        valvulaRetencaoLeve: 2.5,
        valvulaRetencaoPesada: 3.6,
        registroGlooAberto: 11.1,
        registroGavetaAberto: 0.1,
        registroAnguloAberto: 5.9
    },
    {
        int: '21.6',
        ext: '25',
        joelho90: 1.2,
        joelho45: 0.5,
        curva90: 0.5,
        curva45: 0.3,
        T90Direta: 0.8,
        T90Lado: 2.4,
        T90Bilateral: 2.4,
        entradaNormal: 0.4,
        entradaBorda: 1,
        saidaCanal: 0.9,
        valvuladePeEcrivo: 9.5,
        valvulaRetencaoLeve: 2.7,
        valvulaRetencaoPesada: 4.1,
        registroGlooAberto: 11.4,
        registroGavetaAberto: 0.2,
        registroAnguloAberto: 6.1
    },
    {
        int: '27.8',
        ext: '32',
        joelho90: 1.5,
        joelho45: 0.7,
        curva90: 0.6,
        curva45: 0.4,
        T90Direta: 0.9,
        T90Lado: 3.1,
        T90Bilateral: 3.1,
        entradaNormal: 0.5,
        entradaBorda: 1.2,
        saidaCanal: 1.3,
        valvuladePeEcrivo: 13.3,
        valvulaRetencaoLeve: 3.8,
        valvulaRetencaoPesada: 5.8,
        registroGlooAberto: 15,
        registroGavetaAberto: 0.3,
        registroAnguloAberto: 8.4
    },
    {
        int: '35.2',
        ext: '40',
        joelho90: 2,
        joelho45: 1,
        curva90: 0.7,
        curva45: 0.5,
        T90Direta: 1.5,
        T90Lado: 4.6,
        T90Bilateral: 4.6,
        entradaNormal: 0.6,
        entradaBorda: 1,
        saidaCanal: 1.4,
        valvuladePeEcrivo: 15.5,
        valvulaRetencaoLeve: 4.9,
        valvulaRetencaoPesada: 7.4,
        registroGlooAberto: 22,
        registroGavetaAberto: 0.4,
        registroAnguloAberto: 10.5
    },
    {
        int: '44',
        ext: '50',
        joelho90: 3.2,
        joelho45: 1,
        curva90: 1.2,
        curva45: 0.6,
        T90Direta: 2.2,
        T90Lado: 7.3,
        T90Bilateral: 7.3,
        entradaNormal: 1,
        entradaBorda: 2.3,
        saidaCanal: 3.2,
        valvuladePeEcrivo: 18.3,
        valvulaRetencaoLeve: 6.8,
        valvulaRetencaoPesada: 9.1,
        registroGlooAberto: 35.8,
        registroGavetaAberto: 0.7,
        registroAnguloAberto: 17
    },
    {
        int: '53.4',
        ext: '60',
        joelho90: 3.4,
        joelho45: 1.3,
        curva90: 1.3,
        curva45: 0.7,
        T90Direta: 2.3,
        T90Lado: 7.6,
        T90Bilateral: 7.6,
        entradaNormal: 1.5,
        entradaBorda: 2.8,
        saidaCanal: 3.3,
        valvuladePeEcrivo: 23.7,
        valvulaRetencaoLeve: 7.1,
        valvulaRetencaoPesada: 10.8,
        registroGlooAberto: 37.9,
        registroGavetaAberto: 0.8,
        registroAnguloAberto: 18.5
    },
    {
        int: '66.6',
        ext: '75',
        joelho90: 3.7,
        joelho45: 1.7,
        curva90: 1.4,
        curva45: 0.8,
        T90Direta: 2.4,
        T90Lado: 7.8,
        T90Bilateral: 7.8,
        entradaNormal: 1.6,
        entradaBorda: 3.3,
        saidaCanal: 3.5,
        valvuladePeEcrivo: 25,
        valvulaRetencaoLeve: 8.2,
        valvulaRetencaoPesada: 12.5,
        registroGlooAberto: 38,
        registroGavetaAberto: 0.9,
        registroAnguloAberto: 19
    },
    {
        int: '75.6',
        ext: '85',
        joelho90: 3.9,
        joelho45: 1.8,
        curva90: 1.5,
        curva45: 0.9,
        T90Direta: 2.5,
        T90Lado: 8,
        T90Bilateral: 8,
        entradaNormal: 2,
        entradaBorda: 3.7,
        saidaCanal: 3.7,
        valvuladePeEcrivo: 26.8,
        valvulaRetencaoLeve: 9.3,
        valvulaRetencaoPesada: 14.2,
        registroGlooAberto: 40,
        registroGavetaAberto: 0.9,
        registroAnguloAberto: 20
    },
    {
        int: '97.8',
        ext: '110',
        joelho90: 4.3,
        joelho45: 1.9,
        curva90: 1.6,
        curva45: 1,
        T90Direta: 2.6,
        T90Lado: 8.3,
        T90Bilateral: 8.3,
        entradaNormal: 2.2,
        entradaBorda: 4,
        saidaCanal: 3.9,
        valvuladePeEcrivo: 28.6,
        valvulaRetencaoLeve: 10.4,
        valvulaRetencaoPesada: 16,
        registroGlooAberto: 42.3,
        registroGavetaAberto: 1,
        registroAnguloAberto: 22.1
    }
]);
// db.save((err) => {
//     if (err) {
//         console.log(err);
//     }
// });

// db.saveDatabase()
module.exports = { db };