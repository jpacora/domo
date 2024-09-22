const Puerta = require('../libs/Objetos/Puerta')

const puerta = new Puerta(14)

setInterval(() => {
    // si esta cerrado
    if(puerta.cerrada == true) {
        puerta.abrir()
    } else {
        puerta.cerrar()
    }
}, 2500)