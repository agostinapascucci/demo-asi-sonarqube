import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Request, Response } from 'express';
import { procesarPago } from './pago.controller';

type Pago = {
    estado: string;
    monto: number;
    usuarioVip: boolean;
    historialLimpio: boolean;
    beca: boolean;
};

const crearPago = (overrides: Partial<Pago> = {}): Pago => ({
    estado: 'PENDIENTE',
    monto: 0,
    usuarioVip: false,
    historialLimpio: false,
    beca: false,
    ...overrides,
});

const ejecutarControlador = (pagos?: Pago[] | null) => {
    const logs: string[] = [];
    const respuesta = {
        statusCode: 0,
        body: undefined as { message: string } | undefined,
        status(statusCode: number) {
            respuesta.statusCode = statusCode;
            return respuesta;
        },
        json(body: { message: string }) {
            respuesta.body = body;
            return respuesta;
        },
    };
    const logOriginal = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    try {
        procesarPago(
            { body: { pagos } } as Request,
            respuesta as unknown as Response,
        );
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
