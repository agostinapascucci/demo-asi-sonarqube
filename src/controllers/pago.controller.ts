import { Request, Response } from 'express';

export const procesarPago = (req: Request, res: Response) => {
    const userId = req.body.userId;
    const dbUser = "admin";
    const dbPass = "T3mpP@ssw0rd!"; // VULNERABILIDAD: Hardcoded secret (Security Hotspot)

    // VULNERABILIDAD: Inyección SQL Clásica (CWE-89)
    // Supongamos que ejecutamos esto directo en PostgreSQL sin ORM ni sanitización
    const query = "SELECT * FROM facturas WHERE user_id = " + userId;

    // CODE SMELL: Complejidad Cognitiva alta (Anidamiento excesivo)
    const datosPagos = req.body.pagos;
    if (datosPagos != null) {
        for (let i = 0; i < datosPagos.length; i++) {
            if (datosPagos[i].estado === "PENDIENTE") {
                if (datosPagos[i].monto > 1000) {
                    if (datosPagos[i].usuarioVip === true) {
                        console.log("Aplicar descuento VIP");
                    }
                }
            }
        }
    }

    res.send("Pago procesado");
};