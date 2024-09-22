class SensorPH4502C {

    VOLTIO_PH4502C = 5.0 // Voltaje de referencia (5V)
    VOLTIO_MEDIO_PH4502C = 2.5 // Voltaje en el punto neutro de pH 7 (2.5V)
    VOLTIO_POR_PH = 0.18 // Voltaje por cada unidad de pH (0.18V)

    constructor(pin_nivel_ph=null, pin_temp=null, resolucion_adc=1024, num_lecturas=10, intervalo_lectura=100, calibracion=14.8) {
        this._pin_nivel_ph = pin_nivel_ph;  // Pin para el sensor de pH
        this._pin_temp = pin_temp;          // Pin para el sensor de temperatura
        this._resolucion_adc = resolucion_adc;  // Resolución del ADC (por defecto 1024)
        this._num_lecturas = num_lecturas;      // Número de lecturas para hacer el promedio
        this._intervalo_lectura = intervalo_lectura;  // Intervalo entre lecturas en microsegundos (por defecto 100 us)
        this._calibracion = calibracion;      // Valor de calibración (por defecto 14.8)
        // configuramos los pines
        this.configurarPines()
    }

    configurarPines() {
        // validamos si el pin de pH está configurado
        if(this._pin_nivel_ph != null) {
            pinMode(this._pin_nivel_ph, INPUT)
        }

        // validamos si el pin de temperatura está configurado
        if(this._pin_temp != null) {
            pinMode(this._pin_temp, INPUT)
        }
    }

    recalibrar(calibracion) {
        this._calibracion = calibracion
    }

    leer_nivel_ph() {
        if(this._pin_nivel_ph == null) {
            return null
        }
        let lectura = 0.0

        for (let i = 0; i < this._num_lecturas; i++) {
            lectura += analogRead(this._pin_nivel_ph)
            delayMicroseconds(this._intervalo_lectura)
        }

        // Calcular el voltaje y ajustar el valor de pH
        lectura = (this.VOLTIO_PH4502C / this._resolucion_adc) * lectura
        lectura /= this._num_lecturas
        lectura = this._calibracion + ((this.VOLTIO_MEDIO_PH4502C - lectura) / this.VOLTIO_POR_PH)

        return lectura
    }

    leer_nivel_ph_simple() {
        if(this._pin_nivel_ph == null) {
            return null
        }
        let lectura = analogRead(this._pin_nivel_ph)
        lectura = (this.VOLTIO_PH4502C / this._resolucion_adc) * lectura
        return this._calibracion + ((this.VOLTIO_MEDIO_PH4502C - lectura) / this.VOLTIO_POR_PH)
    }

    leer_temperatura() {
        if(this._pin_temp == null) {
            return null
        }
        return analogRead(this._pin_temp)
    }
}

module.exports = SensorPH4502C