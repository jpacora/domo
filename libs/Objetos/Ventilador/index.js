const Relay = require('../../Hardware/Actuadores/Relay')

class Ventilador {

    prendido = null
    
    constructor(pin=13) {
        this.relay = new Relay(pin)
    }

    prender() {
        if(this.prendido === true) {
            return;
        }
        // prender
        this.relay.on()
        this.prendido = true
    }

    apagar() {
        if(this.prendido === false) {
            return;
        }
        // apagar
        this.relay.off()
        this.prendido = false
    }

}

module.exports = Ventilador