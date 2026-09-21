import { Router } from 'express';
import { procesarPago } from '../controllers/pago.controller';

const router = Router();

// Cuando hagan un POST a /api/pagos, se ejecuta nuestra función
router.post('/pagos', procesarPago);

export default router;