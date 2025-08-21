import express from 'express';
import { errors } from 'celebrate';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { errorLogger, requestLogger } from './middlewares/logger';
import config from './config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!config.databaseUrl) {
  throw new Error('DB_ADDRESS is not defined');
}

mongoose.connect(config.databaseUrl)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection error MongoDB:', err);
  });

app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Route not found'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(config.port, () => { console.log('Server started on port 3000'); });
