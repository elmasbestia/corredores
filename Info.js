"use strict";
/* Info de las carreras */
var Carreras = [], nCarreras = 0, Infos = [], nInfos = 0;

function muestra(que) {
    document.getElementsByTagName("ASIDE")[0].innerHTML = infoCarrera()[que];
}

function muestraInfo() {
    document.getElementById("info"+this.id).style.display = "block";
}
function ocultaInfo() {
    for ( var x = 0 ; x < nInfos ; x++ ) { Infos[x].style.display = "none"};
}

function debut() {
    Infos = document.getElementsByClassName("info");
    nInfos = Infos.length;
    Carreras = document.getElementsByClassName("carrera");
    nCarreras = Carreras.length;
    for ( var x = 0 ; x < nCarreras ; x++ ) {
        Carreras[x].onmouseover = muestraInfo;
        Carreras[x].onmouseout = ocultaInfo;        
    }
}
