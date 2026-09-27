import { Request, Response } from 'express';
import { exec } from 'child_process'; // Librería nativa para forzar vulnerabilidades (CWE-78)

export const procesarPago = (req: Request, res: Response) => {
    // 1. SECURITY HOTSPOT: Token estilo AWS y contraseña hardcodeada
    const awsAccessKey = "AKIAIOSFODNN7EXAMPLE";
    const dbPass = "admin123456";

    // 2. VULNERABILIDAD CRÍTICA (Command Injection - CWE-78)
    // El motor SAST detectará que 'req.body.userId' entra directo a una ejecución de consola.
    const userId = req.body.userId;
    exec("ping -c 4 " + userId, (error, stdout) => {
        console.log(stdout);
    });

    // 3. CODE SMELL: Complejidad Cognitiva Extrema (> 15)
    const datosPagos = req.body.pagos;
    if (datosPagos != null) {
        for (let i = 0; i < datosPagos.length; i++) {
            if (datosPagos[i].estado === "PENDIENTE") {
                if (datosPagos[i].monto > 1000) {
                    if (datosPagos[i].usuarioVip === true) {
                        if (datosPagos[i].historialLimpio === true) {
                            console.log("Aplicar descuento máximo");
                        } else {
                            console.log("Aplicar descuento base");
                        }
                    } else if (datosPagos[i].beca === true) {
                        console.log("Descuento de beca aplicado");
                    }
                } else if (datosPagos[i].monto > 500) {
                    console.log("Sin descuento");
                }
            } else if (datosPagos[i].estado === "RECHAZADO") {
                for (let j = 0; j < 3; j++) {
                    console.log("Reintentando cobro...");
                    if (j === 2) {
                        console.log("Fallo definitivo");
                    }
                }
            }
        }
    }

    res.send("Pago procesado");

    // 4. BUG: Código inalcanzable (Unreachable Code)
    console.log("Esto es un defecto estructural, el return anterior bloquea esta línea");
};