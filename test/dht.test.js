const SensorDHT = require('../libs/Hardware/Sensores/DHT')

const sensor = new SensorDHT(15)

setInterval(() => {
    // leemos
    const values = sensor.leerValores()
    console.log({ values })
}, 2500)