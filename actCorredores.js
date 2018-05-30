// Actualiza el localStorage para corredores.html con el contenido de "corredores.json"
// Se puede leer y escribir lo que se indica con el parametro al correr el servicio

let orden = process.argv[2] || "leer";
let corredores = {};

if(orden === "leer") {
    corredores = require("./corredores18.json");
    localStorage.setItem("corredores", corredores);                
} else {
    const fs = require("fs");
    corredores = localStorage.getItem("corredores");  
    fs.writeFile('corredores18.json', JSON.stringify(corredores));
}
console.log(corredores.length, "corredores en tu cuenta");
