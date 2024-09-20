const ActuadorServo = require('../libs/Hardware/Actuadores/Servo')

const servo = new ActuadorServo(14)

let angulo = 0

setInterval(() => {
    // si esta cerrado
    if(angulo == 0) {
        angulo = 0
    } else {
        angulo = 0
    }
    // escirbimos el valor
    servo.rotar(angulo)
}, 2500)