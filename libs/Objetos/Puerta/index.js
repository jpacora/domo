const ActuadorServo = require('../../Hardware/Actuadores/Servo')

class Puerta {

    cerrado = null

    constructor(pin=14) {
        this.servo = new ActuadorServo(pin)
    }

    cerrar() {
        // no hacer nada si ya esta cerrado
        if(this.cerrado === true) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(0)
        this.cerrado = true
    }

    abrir() {
        // no hacer nada si ya esta abierto
        if(this.cerrado === false) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(90)
        this.cerrado = false
    }

}

module.exports = Puerta