const SensorDHT = require('../../Hardware/Sensores/DHT')

class SensorAmbiental {

    humedad = null
    temperatura = null

    constructor(dhtPin=15) {
        this.dht = new SensorDHT(dhtPin)
    }

    leerAmbiente() {
        const ambiente = this.dht.leerValores()
        // update
        if(ambiente != null) {
            this.humedad = ambiente.humedad
            this.temperatura = ambiente.temperatura
        }

        // retornamos
        return { ambiente }
    }

}

module.exports = SensorAmbiental