const SensorDHT = require('../../Hardware/Sensores/DHT')
const SensorPH4502C = require('../../Hardware/Sensores/PH')

class SensorAmbiental {

    humedad = null
    temperatura = null
    ph = null

    constructor(dhtPin=15, phPin=12) {
        this.dht = new SensorDHT(dhtPin)
        this.phSensor = new SensorPH4502C(phPin)
    }

    leerAmbiente() {
        const ambiente = this.dht.leerValores()
        const phValor = this.phSensor.leer_nivel_ph_simple()
        // actualizar datos internos
        if(ambiente != null) {
            this.humedad = ambiente.humedad
            this.temperatura = ambiente.temperatura
        }

        if(phValor != null) {
            this.ph = phValor
        }

        // retornamos
        return { ambiente, ph:phValor }
    }

}

module.exports = SensorAmbiental