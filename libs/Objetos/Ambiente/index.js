const SensorDHT = require('../../Hardware/Sensores/DHT')

class Ambiente {

    constructor(dhtPin=15) {
        this.dht = new SensorDHT(dhtPin)
    }

    leerAmbiente() {
        const amb = this.dht.leerValores()
    }

}