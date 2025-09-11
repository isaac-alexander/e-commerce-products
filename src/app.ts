// handles the apllication setup files, express app, middlewares and routes
import express from 'express';
import cors from 'cors';
import errorHandler from "./middleware/errorHandler";


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (_req, res) => res.json({ status: 'ok', service: 'products-api' }));



app.use(errorHandler);


export default app;