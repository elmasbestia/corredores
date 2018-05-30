var nodemailer = require('nodemailer');
const correo = 'tucartours@gmail.com';

const corredores = require("./corredores18.json");
const msjs = require("./mensajes.json");
const firma = "\n\nQuedamos a tus órdenes.\n\n\n\nRafael Gómez, IT\nVenezuelan Aerobics Tucar Tours";

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: correo,
    pass: 'paraErick'
  }
});

var mailOptions = {
  from: correo,
  to: '',
  subject: 'Inscripción NYCM 2018',
  text: ''
};

let cant = {};
for (let x in msjs) { cant[x] = 0; }
cant.noEnviados = 0;
cant.errores = 0;
cant.total = 0;
let msj = "";

corredores.forEach(x => {
    if(msj = msjs[x.status]) {
        console.log ("Voy con " +x.nombre);
        mailOptions.to = x.correo;
        mailOptions.text = "¡Hola, " +x.nombre +msj +firma;
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(cant.errores, error.response);
                incrementa("errores");
            } else {
                console.log('Enviado: ' + info.response);
                incrementa(x.status);
            }
        });
    } else incrementa("noEnviados");
});

function incrementa(que) {
    cant[que]++;
    if(++cant.total === corredores.length) Resumen();
}

function Resumen() {
    for (let x in cant) { console.log(x, ":", cant[x]); }
}