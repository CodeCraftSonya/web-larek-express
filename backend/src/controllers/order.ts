import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      items,
      total,
      payment,
      email,
      phone,
      address,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('items должен быть непустым массивом'));
    }
    if (!total || typeof total !== 'number') {
      return next(new BadRequestError('total обязателен и должен быть числом'));
    }
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('payment должен быть card или online'));
    }
    if (!email || !email.includes('@')) {
      return next(new BadRequestError('Некорректный email'));
    }
    if (!phone) {
      return next(new BadRequestError('phone обязателен'));
    }
    if (!address) {
      return next(new BadRequestError('address обязателен'));
    }

    const objectIds = items.map((id: string) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: objectIds } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    const notSellable = products.find((p) => p.price == null);
    if (notSellable) {
      return next(new BadRequestError(`Товар "${notSellable.title}" не продается`));
    }

    const sum = products.reduce((acc, p) => acc + (p.price || 0), 0);
    if (sum !== total) {
      return next(new BadRequestError('total не совпадает с суммой товаров'));
    }

    const orderId = faker.string.uuid();

    res.status(200).json({
      id: orderId,
      total,
    });
  } catch (err: any) {
    next(err);
  }
};

export default createOrder;
