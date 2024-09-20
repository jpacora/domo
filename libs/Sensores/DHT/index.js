const { DHT } = require("dht")

class SensorDHT {

    constructor(pin=15) {
        this.dht = new DHT(pin, DHT.DHT11)
    }

    leerValores() {
        const resultado = this.dht.read()

        if(!resultado) {
            return null
        }

        const { humidity:humedad, temperature:temperatura } = this.dht

        return { humedad, temperatura }

    }

}

module.exports = SensorDHT