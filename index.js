const Ejecutor = require('./libs/Ejecutor')

const SensorDHT = require('./libs/Sensores/DHT')

const ejecutor = new Ejecutor()
const dht = new SensorDHT()

setInterval(() => {

    const vals = dht.leerValores()
    // verificamos que haya valores
    if(vals != null) {
        // ejecutamos
        const { humedad, temperatura } = vals
        const acciones = ejecutor.determinarAcciones(temperatura, humedad)
        console.log({ humedad, temperatura, acciones })
    }
    
}, 2500)