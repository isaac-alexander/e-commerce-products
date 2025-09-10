// handles the apllication seup files, express app, middlewares and routes
import express from 'express';
import cors from 'cors';
import productRouter from './routes/products.routes';
import errorHandler from "./middleware/errorHandler";


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (_req, res) => res.json({ status: 'ok', service: 'products-api' }));


app.use('/api/products', productRouter);


app.use(errorHandler);


export default app;