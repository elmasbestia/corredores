"use strict";

const corredores = require("./corredores18.json");

let cant = {};

corredores.forEach(x => {
    if(cant[x.status] === undefined) {
        cant[x.status] = 1;
    } else {
        cant[x.status]++;
    }
});

Resumen();

function Resumen() {
    for (let x in cant) { console.log(x, ":", cant[x]); }
}