import express from 'express';
import {errors} from 'celebrate';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import {errorHandler} from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import {errorLogger, requestLogger} from './middlewares/logger';
import config from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!config.databaseUrl) {
  throw new Error('❌ DB_ADDRESS is not defined in .env');
}

mongoose.connect(config.databaseUrl)
  .then(() => {
    console.log('✅ Успешное подключение к MongoDB');
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
  });

app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(config.port, () => { console.log('Server started port 3000'); });
