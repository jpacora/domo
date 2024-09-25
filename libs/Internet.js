const MQTT = require('mqtt-kaluma')

const { WiFi } = require('wifi')

const wifi = new WiFi()

const DEFAULT_OPTS = {
    "WiFi_Activar": false,
    "WiFi_SSID": null,
    "WiFi_Password": null,
    "MQTT_IP": null,
    "MQTT_Puerto": 1883,
    "MQTT_Topic_Telemetria": "pico/telemetria",
    "MQTT_Topic_Comandos": "pico/comandos"
}

class Internet {

    conWiFi = false
    conectado = false
    mqtt = null
    
    constructor(opts=DEFAULT_OPTS, ejecutor) {
        this.opts = {
            ...DEFAULT_OPTS,
            ...opts
        }
        this.ejecutor = ejecutor
        // conectamos a internet
        if(opts.WiFi_Activar === true) {
            this.conectarWiFi()
        }
    }

    conectarWiFi() {
        const { WiFi_SSID:ssid, WiFi_Password:password } = this.opts

        wifi.connect({
            ssid,
            password
        }, (err) => {
            // verificamos si hay error
            if(err) {
                return console.error(`[WiFi] No se pudo conectar a ${ssid}:`, err)
            }
            // conectado satisfactoriamente
            this.conWiFi = true
            console.log(`[WiFi] Conectado satisfactoriamente a ${ssid}`)
            // conectamos el mqtt
            this.conectarMQTT()
        })

        wifi.on('disconnected', () => {
            console.log(`[WiFi] Desconectado`)
            this.conWiFi = false
        })
    }

    conectarMQTT() {
        const { MQTT_IP:host, MQTT_Puerto:port, MQTT_Topic_Comandos } = this.opts

        console.log(`[MQTT] Conectando a ${host}:${port}`)

        this.mqtt = new MQTT({ host, port, autoConnect: true })

        this.mqtt.on('connect', () => {
            this.conectado = true
            console.log(`[MQTT] Conectado a ${host}`)
            // susccribimos al topic de comandos
            this.mqtt.subscribe(MQTT_Topic_Comandos)
        })

        this.mqtt.on("error", (err) => {
            console.error(`[MQTT] Error:`, err)
        })

        this.mqtt.on('message', ({ topic, payload }) => {
            // verificamos que sea el topic de coamndos
            if(topic == MQTT_Topic_Comandos) {
                // ejecutamos
                this.parsearComando(payload)
            }
        })
    }

    enviarTelemetria(data) {
        const { MQTT_Topic_Telemetria } = this.opts
        if(this.conWiFi == true && this.conectado === true && this.mqtt !== null) {
            // enviar al topico general
            this.mqtt.publish(MQTT_Topic_Telemetria, JSON.stringify(data))
            // flashear leds
            this.ejecutor.flashPattern(200, 100, 5)
            // emit
            Object.keys(data).forEach(item => {
                // publish
                const topic = `${MQTT_Topic_Telemetria}/${item}`
                this.mqtt.publish(topic, JSON.stringify(data[item]))
            })   
        }
    }

    parsearComando(payload) {
        try {
            const strPayload = MQTT.decodeText(payload)
            const json = JSON.parse(strPayload)
            this.ejecutarComando(json)
        } catch(err) {
            console.error(`[MQTT] No se pudo ejecutar el comando`, { payload, err })
        }
    }

    ejecutarComando(comando) {
        if(!comando.tipo) {
            return console.error(`[MQTT] El comando no tiene un tipo`, comando)
        }
        // ejecutamos
        switch(comando.tipo) {
            case 'puerta.abrir':
                this.ejecutor.correrAccion('abrir_puertas')
                break;
            case 'puerta.cerrar':
                this.ejecutor.correrAccion('cerrar_puertas')
                break;
            case 'ventilador.prender':
                this.ejecutor.correrAccion('encender_ventilador')
                break;
            case 'ventilador.apagar':
                this.ejecutor.correrAccion('apagar_ventilador')
                break;
            default:
                console.log(`[MQTT] No existe el tipo de comando ${comando.tipo}`, { comando })
        }
    }

}

module.exports = Internet