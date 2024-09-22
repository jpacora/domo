const { Servo } = require('servo')

class ActuadorServo {

    constructor(pin=14) {

        this.servo = new Servo()
        this.servo.attach(pin)
    }

    rotar(angulo) {
        this.servo.write(angulo)
    }

}

module.exports = ActuadorServo