import express from 'express';
import pagoRoutes from './routes/pago.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// Configuramos la ruta base
app.use('/api', pagoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor de demostración ASI corriendo en http://localhost:${PORT}`);
});