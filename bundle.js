/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaultProfile = __webpack_require__(2)


class Ejecutor {

    bloqueado = false

    constructor(perfil=defaultProfile) {
        //s
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
    }

}

module.exports = Ejecutor

/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('[{"temperatura_min":18,"temperatura_max":26,"humedad_min":50,"humedad_max":70,"acciones":null},{"temperatura_min":26,"temperatura_max":null,"humedad_min":50,"humedad_max":70,"acciones":["abrir_puertas","encender_ventilador"]},{"temperatura_min":26,"temperatura_max":null,"humedad_min":70,"humedad_max":null,"acciones":["abrir_puertas","encender_ventilador"]},{"temperatura_min":26,"temperatura_max":null,"humedad_min":null,"humedad_max":50,"acciones":["abrir_puertas"]},{"temperatura_min":null,"temperatura_max":18,"humedad_min":50,"humedad_max":70,"acciones":["cerrar_puertas","apagar_ventilador"]},{"temperatura_min":null,"temperatura_max":18,"humedad_min":70,"humedad_max":null,"acciones":["cerrar_puertas","encender_ventilador_brevemente"]},{"temperatura_min":null,"temperatura_max":18,"humedad_min":null,"humedad_max":50,"acciones":["cerrar_puertas","apagar_ventilador"]},{"temperatura_min":18,"temperatura_max":26,"humedad_min":70,"humedad_max":null,"acciones":["encender_ventilador","abrir_puertas_opcional"]},{"temperatura_min":18,"temperatura_max":26,"humedad_min":null,"humedad_max":50,"acciones":["cerrar_puertas","apagar_ventilador"]}]');

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { DHT } = __webpack_require__(4)

class SensorDHT {

    constructor(pin=15) {
        this.dht = new DHT(pin, DHT.DHT11)
    }

    leerValores() {
        const resultado = this.dht.read()

        if(!resultado) {
            return null
        }

        const { humidity:humedad, temperature:temperatura } = this.dht

        return { humedad, temperatura }

    }

}

module.exports = SensorDHT

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {

class DHT {
  constructor(pin, type) {
    this.pin = pin;
    this.type = DHT.DHT11;
    if (type) {
      this.type = type;
    }
    this.humidity = -1;
    this.temperature = -1;
  }

  trim(bits) {
    if (bits) {
      // trim first ack signals
      while (bits[0] > 60 || bits[0] < 40) {
        bits.shift();
      }
      // trim unnecessary tail signals
      while (bits.length > 80) {
        bits.pop();
      }
    }
  }

  toBytes(bits) {
    var bytes = [0, 0, 0, 0, 0];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 8; j++) {
        if (bits[(i * 8 + j) * 2] > 40 && bits[(i * 8 + j) * 2] < 60) {
          if (bits[(i * 8 + j) * 2 + 1] > 50) {
            bytes[i] = bytes[i] | (1 << (7 - j));
          }
        }
      }
    }
    return bytes;
  }

  checksum(bytes) {
    return ((bytes[0] + bytes[1] + bytes[2] + bytes[3]) & 0xff) === bytes[4];
  }

  decode(bytes, type) {
    if (this.checksum(bytes) === true) {
      var data = [-1, -1];
      if (type === DHT.DHT11) {
        data[0] = bytes[0] + bytes[1] * 0.1;
        if ((bytes[3] & 0x80) === 0x80) {
          data[1] = -1 - bytes[2] + (bytes[3] & 0x0f) * 0.1;
        } else {
          data[1] = bytes[2] + (bytes[3] & 0x0f) * 0.1;
        }
      } else if (type === DHT.DHT12) {
        data[0] = bytes[0] + bytes[1] * 0.1;
        data[1] = (bytes[2] & 0x7f) + (bytes[3] & 0x0f) * 0.1;
        if ((bytes[3] & 0x80) === 0x80) {
          data[1] *= -1;
        }
      } else {
        // DHT21, DHT22
        data[0] = ((bytes[0] << 8) | bytes[1]) * 0.1;
        if ((bytes[2] & 0x80) === 0x80) {
          data[1] = (((bytes[2] & 0x7f) << 8) | bytes[3]) * -0.1;
        } else {
          data[1] = (((bytes[2] & 0x7f) << 8) | bytes[3]) * 0.1;
        }
      }
      return data;
    }
    return null;
  }

  read() {
    var bits = pulseRead(this.pin, 100, {
      timeout: 25000,
      startState: LOW,
      mode: INPUT,
      trigger: {
        startState: HIGH,
        interval: [10000, 18000],
      },
    });
    this.trim(bits);
    if (bits === null || bits.length !== 80) {
      return null;
    }
    // decodes
    var bytes = this.toBytes(bits);
    var data = this.decode(bytes, this.type);
    if (data) {
      this.humidity = data[0];
      this.temperature = data[1];
      return data;
    }
    return null;
  }
}

DHT.DHT11 = 0;
DHT.DHT12 = 1;
DHT.DHT21 = 2;
DHT.DHT22 = 3;

exports.DHT = DHT;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const Ejecutor = __webpack_require__(1)

const SensorDHT = __webpack_require__(3)

const ejecutor = new Ejecutor()
const dht = new SensorDHT()

setInterval(() => {

    const vals = dht.leerValores()
    // verificamos que haya valores
    if(vals != null) {
        // ejecutamos
        const { humedad, temperatura } = vals
        const acciones = ejecutor.determinarAcciones(temperatura, humedad)
        console.log({ humedad, temperatura, acciones })
    }
    
}, 2500)
/******/ })()
;