const defaultProfile = require('../perfiles/default.json')


class Ejecutor {

    bloqueado = false

    constructor(dispositivos={}, perfil=defaultProfile) {
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
        return null
    }

    ejecutarAcciones(acciones) {
        // vemos que existan accioens por ejecutar
        if(acciones == null) {
            return;
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
                break
            case 'abrir_puertas_opcional':
                console.log('abrir_puertas_opcional')
                break
            default:
                console.log(`[ERROR] No existe la acción "${accion}"`)
        }
    }

    telemetria() {
        const { cerrada:puertaCerrada } = this.puerta
        const { prendido:ventiladorPrendido } = this.ventilador
        return {
            puertaCerrada,
            ventiladorPrendido
        }
    }

}

module.exports = Ejecutor