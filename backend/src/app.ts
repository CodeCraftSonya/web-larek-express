import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const { DB_ADDRESS } = process.env;

if (!DB_ADDRESS) {
  throw new Error('❌ DB_ADDRESS is not defined in .env');
}

mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log('✅ Успешное подключение к MongoDB');
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
  });

app.use('/', productRoutes);
app.use('/', orderRoutes);

app.listen(3000, () => { console.log('Server started port 3000'); });
