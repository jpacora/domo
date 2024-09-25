const defaultProfile = require('../perfiles/default.json')

const { PicoCYW43 } = require('pico_cyw43')
const pico_cyw43 = new PicoCYW43()


class Ejecutor {

    bloqueado = false
    modoAutomatico = true

    constructor(dispositivos={}, perfil=defaultProfile) {
        this.bloquear = this.bloquear.bind(this)
        this.perfil = perfil
        //
        this.puerta = dispositivos.puerta
        this.ventilador = dispositivos.ventilador
    }

    determinarAcciones = (temperatura, humedad) => {
        // convertimos a entero
        temperatura = parseInt(temperatura)
        // iteramos las reglas
        for (const regla of this.perfil) {
            const temperaturaEnRango = (!regla.temperatura_min || temperatura >= regla.temperatura_min) &&
                                (!regla.temperatura_max || temperatura <= regla.temperatura_max);
            const humedadEnRango = (!regla.humedad_min || humedad >= regla.humedad_min) &&
                               (!regla.humedad_max || humedad <= regla.humedad_max);
            
            if (temperaturaEnRango && humedadEnRango) {
                return regla.acciones;
            }
        }
        return ['proteger_domo']
        //return null
    }

    ejecutarAcciones(acciones) {
        // vemos que existan accioens por ejecutar
        if(acciones == null) {
            // clima idoneo
            acciones = ['proteger_domo']
            //return;
        }
        // verificamos si está bloqueado
        if(this.bloqueado == true) {
            return console.log(`[ERROR] El ejecutor se encuentra bloqueado`, { acciones })
        }
        // ejecutamos las acciones
        acciones.forEach(this.correrAccion.bind(this))
    }

    correrAccion(accion) {
        switch(accion) {
            case 'abrir_puertas':
                console.log('abrir_puertas')
                this.puerta.abrir()
                break
            case 'encender_ventilador':
                console.log('encender_ventilador')
                this.ventilador.prender()
                break
            case 'cerrar_puertas':
                console.log('cerrar_puertas')
                this.puerta.cerrar()
                break
            case 'apagar_ventilador':
                console.log('apagar_ventilador')
                this.ventilador.apagar()
                break
            case 'encender_ventilador_brevemente':
                console.log('encender_ventilador_brevemente')
                this.ventilador.prender()
                this.bloquear(15 * 1000, () => {
                    // despues de bloquear
                    this.ventilador.apagar()
                })
                break
            case 'abrir_puertas_opcional':
                console.log('abrir_puertas_opcional')
                break
            case 'proteger_domo':
                console.log('proteger_domo')
                this.puerta.cerrar()
                this.ventilador.apagar()
                break
            default:
                console.log(`[ERROR] No existe la acción "${accion}"`)
        }
    }

    telemetria() {
        const { modoAutomatico:auto } = this
        const { cerrada:puertaCerrada } = this.puerta
        const { prendido:ventiladorPrendido } = this.ventilador
        return {
            auto,
            puertaCerrada,
            ventiladorPrendido
        }
    }

    bloquear(ms, callback) {
        this.bloqueado = true
        setTimeout(() => {
            // ejecutar callback
            if(callback) {
                callback()
            }
            // desbloqueamos
            this.bloqueado = false
        }, ms)
    }

    /*
        LED Indicador
    */

    flashPattern(onTime=200, offTime=200, repeat=1) {
        for (let i = 0; i < repeat; i++) {
            // Enciende el LED
            pico_cyw43.putGpio(0, true)
            delay(onTime) // Espera el tiempo que el LED debe estar encendido
            // Apaga el LED
            pico_cyw43.putGpio(0, false)
            delay(offTime) // Espera el tiempo que el LED debe estar apagado
        }
    }

}

module.exports = Ejecutor