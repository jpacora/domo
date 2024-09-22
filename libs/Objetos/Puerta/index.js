const ActuadorServo = require('../../Hardware/Actuadores/Servo')

class Puerta {

    cerrada = null

    constructor(pin=14) {
        this.servo = new ActuadorServo(pin)
    }

    cerrar() {
        // no hacer nada si ya esta cerrado
        if(this.cerrada === true) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(0)
        this.cerrada = true
    }

    abrir() {
        // no hacer nada si ya esta abierto
        if(this.cerrada === false) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(90)
        this.cerrada = false
    }

}

module.exports = Puerta