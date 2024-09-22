const SensorAmbiental = require('../libs/Objetos/SensorAmbiental')

const sensorAmbiental = new SensorAmbiental(15)

setInterval(() => {
    // leemos
    const { ambiente:values } = sensorAmbiental.leerAmbiente()
    console.log({ values })
}, 2500)