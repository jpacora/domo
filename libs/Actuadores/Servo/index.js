const { Servo } = require('servo')

class ActuadorServo {

    constructor(pin=15) {

        this.servo = new Servo()
        this.servo.attach(pin)
    }

    rotar(angulo) {
        this.servo.write(angulo)
    }

}

module.exports = ActuadorServo