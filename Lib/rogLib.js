
		function objDom(dom) { return typeof dom === "string" ? document.getElementById(dom) : dom }

        function rogAsigna(selector,evento,fn) {
            let arreglo = document.querySelectorAll(selector);
            for(let x = 0; x < arreglo.length;x++) {
                arreglo[x][evento] = fn;
            }
        }

        function btnDefault(dom,boton) {
            let btn = objDom(boton);
            let obj = objDom(dom);
			obj.oninput = (e) => { btn.disabled = !Boolean(e.target.value) };
            obj.onkeypress = (e) => { if(e.keyCode === 13) btn.click() };
        }
        
		function clsEspera() { return 'fa-li fa fa-spinner fa-spin' }
		
		function clsBsq() {	return 'fa fa-search' }
		
		function accede(accion,url,fn,datos) {
            var xobj = new XMLHttpRequest();

			function xmlEstado(estado) {
				switch (estado) {
					case 0: return "No inicializado";	// request not initialized
					case 1: return "Conectado"; 			// server connection established
					case 2: return "Recibido"; 			// request received
					case 3: return "Procesando";			// processing request
					case 4: return "Listo";				// request finished and response is ready
				}
			}
			
			function msjErrorXML(e) {
				alert("¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
			}
             
//			if (datos) datos = JSON.stringify(datos);
             
            xobj.overrideMimeType("application/json");
            xobj.open(accion, url, true);
            xobj.onerror = msjErrorXML;
//            xobj.onprogress = (e) => { console.log("Progress: ", e) }
            xobj.onreadystatechange = () => { console.log(xobj.readyState, xmlEstado(xobj.readyState)," (", xobj.status,")") };
            xobj.onload = () => {
				if (xobj.status < 400) {
					if(accion === "GET") {
						fn(JSON.parse(xobj.responseText));
					} else {
						fn(xobj.responseText);
					}
				} else {
					msjErrorXML();
				}
			};
            xobj.send(datos);
        }
        
		function leeJson(url,fn,fnDebut) {
            /*
                Lectura de un archivo json
                @param url      dirección del archivo a ser leído
                @param fn       función a ejecutarse con el contenido del archivo
                @param fnDebut  función a ejecutarse antes de iniciar la lectura
            */
            var xobj = new XMLHttpRequest();
            
            xobj.overrideMimeType("application/json");
            xobj.open("GET", url, true);
            xobj.onerror = (e) => {
				alert("Error del Navegador!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")");
			}
            xobj.onloadstart = fnDebut;
            xobj.onreadystatechange = () => {
                console.log("State:",xobj.readyState,"Status:", xobj.status);
                if (xobj.readyState == 4 && xobj.status == "200") {
                    console.log("Leyó!")
                }
            };
            xobj.onload = () => { fn(JSON.parse(xobj.responseText)) };
            xobj.send();
        }
        
        function escribeJson(url,fn,fnDebut) {
            /*
                Lectura de un archivo json
                @param url      dirección del archivo a ser leído
                @param fn       función a ejecutarse con el contenido del archivo
                @param fnDebut  función a ejecutarse antes de iniciar la lectura
            */
            var xobj = new XMLHttpRequest();
            
            xobj.overrideMimeType("application/json");
            xobj.open("PUT", url, true);
            xobj.onerror = (e) => {
				alert("Error del Navegador!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")")
			}
            xobj.onloadstart = fnDebut;
            xobj.onprogress = (e) => {
				console.log("Progress: ")
			}
            xobj.onreadystatechange = () => {
                console.log("State:",xobj.readyState,"Status:", xobj.status)
                if (xobj.readyState == 4 && xobj.status == "200") {
                    console.log("Escribió!")
                }
            };
            xobj.onload = () => { alert("¡Archivo actualizado!") };
            xobj.send();
        }

        function moveCorresponding(Formulario,valores,valPorOmision) {
            var elementos = objDom(Formulario).elements;
            var arreglo = [];
            
            let n = elementos.length;
            for (let i = 0; i < n ;i++) {
                if(valores[elementos[i].name] !== undefined) elementos[i].value = valores[elementos[i].name];
				else if(valPorOmision[elementos[i].name] !== undefined) {elementos[i].value = valPorOmision[elementos[i].name]}
            }
        }
        
		function leeFicha(agrega) {
			var elementos = Ficha.elements;
			var campos = {};
			let accion, ruta;

            iniProcede();
            
			for (let x in Estructura) { campos[x] = elementos[x].value; }
			
			if(agrega) {
                accion = "POST";
                ruta = "post";
			} else {
                accion = "PUT";
                ruta = "put/"+campos.BN_IDEN;
			}
            accede(accion, svrURL+ruta, (resp) => { finProcede(resp) }, campos);
		}
		
        function iniProcede () {
            btnEspera.style.display = "inline";
            btnProcede.disabled = true;
        }
        function finProcede(resp) {
            alert("Llegó la respuesta: "+resp);

            btnEspera.style.display = "none";
            btnProcede.disabled = false;
        }
        
		function cierraFicha(e) { this.parentElement.parentElement.style.display = "none" }

function creaCombo(que) {
	function creaOpcion(item) {
		var opcion = document.createElement("OPTION");
	
		if (typeof item === "string") {
			opcion.value = item
			opcion.appendChild(document.createTextNode(item))
		} else {
			opcion.value = item.valor
			opcion.appendChild(document.createTextNode(item.texto));
		}
		return opcion;
	}
	accede("GET", svrURL+que,(datos) => {
		let cmb = document.getElementById(que);
	
		datos.map(x => { cmb.appendChild(creaOpcion(x.valor)) });
	});
}

function mstTabla(datos,dom,caption = "",lista,Fn,nbId="") {
	let donde = objDom(dom);

	function celda(valor,nb) { return "<td"+ (nb === nbId ? " class='rogId'"	: "")+">" + (valor || "") +"</td>" }
    
    if(datos) {
        let tabla = "<table><caption><h3>" +caption+ "<sup><span class='badge'>"+datos.length+"</span></sup></h3></caption>";
        let titulos, linea;

        datos.forEach(e => {
            if (!titulos) {
                titulos = "<thead><tr>";
                if(lista) {
                    (typeof lista === "string" ? lista.split(",") : lista).map((x) => {
                        titulos += "<th>"+x+"</th>";
                    })
                    linea = (x,lista) => {
                        lista.map((nbCampo) => {
                            tabla += celda(x[nbCampo],nbCampo)
                        })
                    }
                } else {
                    for (x in e) {
                        titulos += "<th>"+x+"</th>";
                    }
                    linea = (e,lista) => {
                        for (x in e) {
                            tabla += celda(e[x],x);
                        }
                    }
                }
                titulos += "</tr></thead>";
                tabla += titulos+"<tbody>";
            }
            tabla +="<tr>";
            linea (e,lista);
            tabla +="</tr>";
        });
        tabla += "</tbody></table>";

        donde.innerHTML = tabla;
        if (Fn) {
            let i = 0;
            let rogIds = document.getElementsByClassName("rogId");
            let nRogIds = rogIds.length;
            for(; i < nRogIds; i++ ) {
                rogIds[i].onclick = Fn;
                rogIds[i].cursor = "pointer";
            }
        }
    } else {
        donde.innerHTML = "<h3>No hay " +caption+ "</h3>"
    }
}
