const Ejecutor = require('./libs/Ejecutor')

const SensorAmbiental = require('./libs/Objetos/SensorAmbiental')
const Puerta = require('./libs/Objetos/Puerta')
const Ventilador = require('./libs/Objetos/Ventilador')


const sensorAmbiental = new SensorAmbiental()
const puerta = new Puerta()
const ventilador = new Ventilador()

const ejecutor = new Ejecutor({
    puerta,
    ventilador,
    sensorAmbiental
})


setInterval(() => {

    const { ambiente } = sensorAmbiental.leerAmbiente()
    // verificamos que haya valores
    if(ambiente != null) {
        const state = ejecutor.telemetria()
        // ejecutamos
        const { humedad, temperatura } = ambiente
        const acciones = ejecutor.determinarAcciones(temperatura, humedad)
        console.log({ambiente, acciones, state})
        // ejecutamos las acciones
        ejecutor.ejecutarAcciones(acciones)
        console.log("---------------------------")
    }
    
}, 2500)