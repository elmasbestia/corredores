// Servidor para Corredores del NYCM
// Rafa Gómez https://rafagomez.neocities.org

"use strict";
var guardarSiempre = false;

const cors = require('cors');
const app = require('express')();
const logger = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const path = require('path');

const corredores = require("./corredores18.json");

function guarda() { } // Guarda los datos en el archivo

function bsq(query) {
    console.log(query)
    let { que, valor } = query;
    console.log("Lee corredores con que:", que);
    if (que) {
	    console.log(que," = ", valor);
	    if(que === "Nombre") return corredores.filter(x => x[que].indexOf(valor) > -1);
	    return corredores.filter(x => x[que] === valor);
    } else return corredores;
}

function strCompara(que,descendente){
	var menor = 1, mayor = -1;
    if (descendente) { const menor = -1, mayor = 1}
    var define = x => x === undefined ? "" : x;
	return (a,b) => (define(a[que]) < define(b[que])) ? mayor : (define(a[que]) > define(b[que])) ? menor : 0;
}

function lista(que) {
	let lista = [];
	let valor, cant = 0;
  
	corredores.sort(strCompara(que)).forEach(x => {
		if (valor != x[que]) {
			lista.push({valor: valor, cant: cant});
			valor = x[que];
			cant = 0;
		}
		cant++;
	});
	lista.push({valor: valor, cant: cant});
	if(lista[0].cant === 0) lista.shift();
	else lista[0].valor = "(Indefinido)";

	return lista;
}
										// MIDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(errorhandler());

app.use((req, res, next) => {
	// Guardar Datos
	
	if (guardarSiempre ) guarda();
	next();
});

app.param('id', (req, res, next) => {
    req.corredor = corredores[req.params.id];

    next();
});
                                    // L I B R E R I A
app.get('/rogLib/:modulo', (req, res) => {
  res.sendFile(path.join(__dirname,'/Lib/',req.params.modulo));
});
									// R U T A S
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname,'Corredores.html'));
});

app.get('/corredores', (req, res) => {
    console.log("Anda a bsq con ", req.query)
    res.send(bsq (req.query));
});

app.get('/corredor/:id', (req,res) => {
	res.status(200).send(req.corredor);
});

app.post('/corredor', (req, res) => {
	let id = corredores.length;
	corredores.push(req.body);
	res.status(201).send({id: id});
});

app.put('/corredor/:id', (req, res) => {
	Object.assign(req.corredor,req.body);
	res.status(200).send(req.corredor);
});

app.delete('/corredor/:id', (req, res) => {
	req.corredor.descarte = true;

	res.status(204).send();
});
  
app.listen(3000);
console.log("Corredores en el puerto 3000");

/*
 * H o o k s
bookSchema.pre('save', function(next) {
    //prepare for saving
    //upload PDF
    return next()
})
On the other hand, before removing, we need to make sure there are no pending purchase orders for this book:

bookSchema.pre('remove', function(next) {
    //prepare for removing
    return next(e)
})
*/
