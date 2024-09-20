const Ejecutor = require('../libs/Ejecutor')

const ejecutor = new Ejecutor()
const act = ejecutor.determinarAcciones(27, 71)


ejecutor.ejecutarAcciones(act)
