const app = require('./app');
const request = require('supertest');


describe('GET /', function() {
    it('Homepage', async() => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /studenti', function() {
    it('Lista studenti', async() => {
    const response = await request(app).get('/studenti');
        expect(response.statusCode).toBe(200);
    });
  });

describe('GET /studenti/nome', function() {
    it('Trova uno studente per nome', async() => {
    const response = await request(app).get('/studenti/nome?nome=Michele');
        expect(response.statusCode).toBe(200);
        for(var i = 0; i < response.body.length - 1; i++) {
            expect(response.body[i].nome).toEqual("Michele");
        }
    });
    it('Respond 404 if studente not found', async() => {
        const response = await request(app).get('/studenti/nome?nome=0aB8328');
        expect(response.statusCode).toBe(404);
    });
});

describe('POST /studenti --- caricamento nuovi studenti', () => {
    it('---> responds with json and should return 200', function(done) {
        request(app)
        .post('/studenti')
        .send({
            nome: "Marco",
            cognome: 'Zippo',
            nascita: '11/08/1989',
            matricola: 111111 })
        .set('Accept', 'application/json')
        .expect(200)
        .end(done);
    });
    it('---> should return 400 - Bad Request', function(done) {
        request(app)
        .post('/studenti')
        .send({
            nome: "Marco",
            cognome: 'Zippo',
            nascita: 11,
            matricola: 111111  })
        .expect(400)
        .end(done);
        });
});

describe('PUT /studenti/matricola --> should be 404', () => {
    it('--->  restituisce stato 404 con esame non aggiornato', function(done) {
        request(app)
        .put('/studenti/matricola?matricola=029312')
        .expect(404)
        .end(done);
    });
});

describe('PUT /studenti/matricola --> should be 200', () => {
    it('--->  restituisce stato 200 con esame aggiornato', function(done) {
        request(app)
        .put('/studenti/matricola?matricola=192762')
        .send({
            "nome": "Matteo" })
        .set('Accept', 'application/json')
        .expect(200)
        .end(done);
    });
});

describe('DELETE /studenti/matricola', () => {
    //Elimino uno studente esistente e mi aspetto che lo status sia 200
    it('--->  restituisce stato 200 con studente cancellato', function(done) {
        request(app)
            .delete('/studenti/matricola?matricola=192762')
            .expect(200)
            .end(done); 
    }); 
    
    //Elimino uno studente assumendo che non esiste e mi aspetto che lo status sia 404
    it('---> restituisce stato 404 perche cerco di cancellare oggetto inesistente', function(done){
        request(app)
        .delete('/studenti/matricola?nome=Eleonora')
        .expect(404)
        .end(done); 
    });
 });