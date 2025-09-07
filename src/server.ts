import app from './app';
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});