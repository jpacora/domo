const defaultProfile = require('../perfiles/default.json')


class Ejecutor {

    bloqueado = false

    constructor(perfil=defaultProfile) {
        this.perfil = perfil
    }

    determinarAcciones = (temperatura, humedad) => {
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
        // verificamos si está bloqueado
        if(this.bloqueado == true) {
            return console.log(`[ERROR] El ejecutor se encuentra bloqueado`, { acciones })
        }
        // ejecutamos las acciones
        acciones.forEach(this.correrAccion)
    }

    correrAccion(accion) {
        switch(accion) {
            case 'abrir_puertas':
                console.log('abrir_puertas')
                break
            case 'encender_ventilador':
                console.log('encender_ventilador')
                break
            case 'cerrar_puertas':
                console.log('cerrar_puertas')
                break
            case 'apagar_ventilador':
                console.log('apagar_ventilador')
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

}

module.exports = Ejecutor