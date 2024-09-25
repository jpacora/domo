const config = require('./config.cueva.json')
const Ejecutor = require('./libs/Ejecutor')
const Internet = require('./libs/Internet')

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

const internet = new Internet(config, ejecutor)


setInterval(() => {

    if(ejecutor.bloqueado == true) {
        return console.log(`[Main] Ejecutor bloqueado`)
    }

    const { ambiente, ph } = sensorAmbiental.leerAmbiente()
    // verificamos que haya valores
    if(ambiente != null) {
        const telemetria = ejecutor.telemetria()
        internet.enviarTelemetria({ ...telemetria, ...ambiente, ph })
        // ejecutamos
        const { humedad, temperatura } = ambiente
        const acciones = ejecutor.determinarAcciones(temperatura, humedad)
        console.log({ambiente, ph, acciones, telemetria})
        // ejecutamos las acciones
        ejecutor.ejecutarAcciones(acciones)
        console.log("---------------------------")
    }
    
}, 2500)