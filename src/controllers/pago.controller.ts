import { Request, Response } from 'express';

export const procesarPago = (req: Request, res: Response) => {
    // TODO: Implementar lógica de pagos en la rama feature/modulo-pagos
    res.status(200).json({ mensaje: "Endpoint de pagos configurado" });
};