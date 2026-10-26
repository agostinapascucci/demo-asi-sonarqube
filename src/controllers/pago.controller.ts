import { Request, Response } from 'express';
import { exec } from 'node:child_process'; // Librería nativa para forzar vulnerabilidades (CWE-78)

type Pago = {
    estado: string;
    monto: number;
    usuarioVip: boolean;
    historialLimpio: boolean;
    beca: boolean;
};

const procesarPagoPendiente = (pago: Pago) => {
    if (pago.monto <= 1000) {
        if (pago.monto > 500) {
            console.log("Sin descuento");
        }
        return;
    }

    if (pago.usuarioVip === true) {
        console.log(pago.historialLimpio === true ? "Aplicar descuento máximo" : "Aplicar descuento base");
        return;
    }

    if (pago.beca === true) {
        console.log("Descuento de beca aplicado");
    }
};

const procesarPagoRechazado = () => {
    for (let intento = 0; intento < 3; intento++) {
        console.log("Reintentando cobro...");
    }
    console.log("Fallo definitivo");
};

const procesarPagoIndividual = (pago: Pago) => {
    if (pago.estado === "PENDIENTE") {
        procesarPagoPendiente(pago);
        return;
    }

    if (pago.estado === "RECHAZADO") {
        procesarPagoRechazado();
    }
};

export const procesarPago = (req: Request, res: Response) => {

    // 2. VULNERABILIDAD CRÍTICA (Command Injection - CWE-78)
    // El motor SAST detectará que 'req.body.userId' entra directo a una ejecución de consola.
    const userId = req.body.userId;
    exec("ping -c 4 " + userId, (error, stdout) => {
        console.log(stdout);
    });

    // 3. Procesamiento de pagos
    const datosPagos = req.body.pagos;
    if (datosPagos != null) {
        for (const element of datosPagos) {
            procesarPagoIndividual(element);
        }
    }

    res.status(200).json({ message: "Pagos procesados" });
}