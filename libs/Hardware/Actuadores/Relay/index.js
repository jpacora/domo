class Relay {
    

    constructor(pin=13) {
        this.pin = pin
        console.log(`[RELAY] Pin: ${pin}`)
        pinMode(pin, OUTPUT)
    }

    on() {
        digitalWrite(this.pin, HIGH)
        console.log(`[Relay] ON`)
    }

    off() {
        digitalWrite(this.pin, LOW)
        console.log(`[Relay] OFF`)
    }
}

module.exports = Relay