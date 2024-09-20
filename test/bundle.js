/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ActuadorServo = __webpack_require__(2)

class Puerta {

    cerrado = null

    constructor(pin=14) {
        this.servo = new ActuadorServo(pin)
    }

    cerrar() {
        // no hacer nada si ya esta cerrado
        if(this.cerrado === true) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(0)
        this.cerrado = true
    }

    abrir() {
        // no hacer nada si ya esta abierto
        if(this.cerrado === false) {
            return;
        }
        // cerrar la puerta
        this.servo.rotar(90)
        this.cerrado = false
    }

}

module.exports = Puerta

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Servo } = __webpack_require__(3)

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

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { PWM } = __webpack_require__(4);

class Servo {
  constructor() {
    this.pin = -1;
    this.period = 20000; // 50Hz
    this.min = 544;
    this.max = 2400;
    this.pwm = null;
  }

  attach(pin, min, max, period) {
    if (this.pin < 0) {
      this.pin = pin;
      if (min) this.min = min;
      if (max) this.max = max;
      if (period) this.period = period;
      var hz = 1000000 / this.period;
      this.pwm = new PWM(this.pin, hz, this.min);
      this.pwm.start();
    } else {
      throw "Already attached";
    }
  }

  detach() {
    this.pin = -1;
    this.pwm.stop();
    this.pwm.close();
  }

  write(angle) {
    var d = (this.max - this.min) / 180;
    this.pwm.setDuty((this.min + angle * d) / this.period);
  }

  read() {
    var d = (this.max - this.min) / 180;
    var angle = (this.pwm.getDuty() * this.period - this.min) / d;
    return angle;
  }
}

exports.Servo = Servo;


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("pwm");

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
const Puerta = __webpack_require__(1)

const puerta = new Puerta(14)

setInterval(() => {
    // si esta cerrado
    if(puerta.cerrado == true) {
        puerta.abrir()
    } else {
        puerta.cerrar()
    }
}, 2500)
/******/ })()
;