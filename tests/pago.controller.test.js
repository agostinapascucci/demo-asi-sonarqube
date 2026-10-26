const assert = require('node:assert/strict');
const { test } = require('node:test');
const { procesarPago } = require('../dist/controllers/pago.controller.js');

const crearPago = (overrides = {}) => ({
    estado: 'PENDIENTE',
    monto: 0,
    usuarioVip: false,
    historialLimpio: false,
    beca: false,
    ...overrides,
});

const ejecutarControlador = (pagos) => {
    const logs = [];
    const respuesta = {
        statusCode: 0,
        body: undefined,
        status(statusCode) {
            respuesta.statusCode = statusCode;
            return respuesta;
        },
        json(body) {
            respuesta.body = body;
            return respuesta;
        },
    };
    const logOriginal = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    try {
        procesarPago({ body: { pagos } }, respuesta);
    } finally {
        console.log = logOriginal;
    }

    return { logs, respuesta };
};

test('aplica el descuento máximo a un pago pendiente VIP con historial limpio', () => {
    const resultado = ejecutarControlador([
        crearPago({ monto: 1001, usuarioVip: true, historialLimpio: true }),
    ]);

    assert.deepEqual(resultado.logs, ['Aplicar descuento máximo']);
    assert.equal(resultado.respuesta.statusCode, 200);
    assert.deepEqual(resultado.respuesta.body, { message: 'Pagos procesados' });
});

test('aplica el descuento base al pago pendiente VIP con historial no limpio', () => {
    const resultado = ejecutarControlador([
        crearPago({ monto: 1001, usuarioVip: true }),
    ]);

    assert.deepEqual(resultado.logs, ['Aplicar descuento base']);
});

test('aplica descuento de beca a un pago pendiente no VIP de más de 1000', () => {
    const resultado = ejecutarControlador([
        crearPago({ monto: 1001, beca: true }),
    ]);

    assert.deepEqual(resultado.logs, ['Descuento de beca aplicado']);
});

test('no aplica descuento sobre 500 y hasta 1000 inclusive', () => {
    const resultado = ejecutarControlador([
        crearPago({ monto: 500 }),
        crearPago({ monto: 501 }),
        crearPago({ monto: 1000 }),
    ]);

    assert.deepEqual(resultado.logs, ['Sin descuento', 'Sin descuento']);
});

test('reintenta tres veces y luego informa el fallo definitivo', () => {
    const resultado = ejecutarControlador([
        crearPago({ estado: 'RECHAZADO' }),
    ]);

    assert.deepEqual(resultado.logs, [
        'Reintentando cobro...',
        'Reintentando cobro...',
        'Reintentando cobro...',
        'Fallo definitivo',
    ]);
});

test('no procesa estados desconocidos y responde correctamente si no hay pagos', () => {
    const resultado = ejecutarControlador([
        crearPago({ estado: 'APROBADO' }),
    ]);
    const resultadoSinPagos = ejecutarControlador(null);

    assert.deepEqual(resultado.logs, []);
    assert.deepEqual(resultadoSinPagos.logs, []);
    assert.equal(resultadoSinPagos.respuesta.statusCode, 200);
    assert.deepEqual(resultadoSinPagos.respuesta.body, { message: 'Pagos procesados' });
});
