const express = require('express');
const app = express();
app.use(express.json());
const studenti = require('./db_studenti').studenti;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => res.send('Hello World').status(200));

app.get('/studenti', (req,res) => {
    res.json(studenti).status(200);
});

app.get('/studenti/nome', (req, res) => {
    const studente = studenti.filter(c => c.nome === req.query.nome);
    if(studente[0] != null)
        res.json(studente).status(200);
    else
        res.status(404).json({msg: 'Errore - studente non trovato'});
});

app.post('/studenti', (req, res) => {
    const studente = {
        nome : req.body.nome,
        cognome : req.body.cognome,
        nascita : req.body.nascita,
        matricola : req.body.matricola
    }
    if((typeof(req.body.nome) === "string")&& 
    (typeof(req.body.cognome) === "string") &&
    (typeof(req.body.nascita) === "string") &&
    (typeof(req.body.matricola) === "number")) {
        studenti.push(studente);
        res.json(studente).status(200);
    }
    else
        res.status(400).json({msg: 'Errore - input non validi'});
});

app.put('/studenti/matricola', (req, res) => {
    const studente = studenti.find(c => c.matricola == req.query.matricola);


    if(studente != null){
        const index = studenti.indexOf(studente);
        const keys =  Object.keys(req.body);

        keys.forEach(key => {
            studente[key] = req.body[key];
        });

        studenti[index] = studente;
        res.status(200).json(studente);
    }
    else
        res.status(404).json({msg: 'Errore - studente non trovato'})
});

app.delete('/studenti/matricola', (req, res) => {
    const studente = studenti.find(c => c.matricola == req.query.matricola);
    if(studente != null) {
        const indice = studenti.indexOf(studente);
        studenti.splice(indice, 1);
        res.status(200).json({msg: 'Cancellato'});
    }
    else {
        res.status(404).json({msg: 'Errore - studente non trovato'});
    }
});
module.exports = app;