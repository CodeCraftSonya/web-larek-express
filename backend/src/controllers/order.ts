import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {faker} from '@faker-js/faker';
import validator from 'validator';
import Product from '../models/product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total, payment, email, phone, address } = req.body;

    // ✅ Проверка обязательных полей
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items должен быть непустым массивом' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ message: 'total обязателен и должен быть числом' });
    }
    if (!['card', 'online'].includes(payment)) {
      return res.status(400).json({ message: 'payment должен быть card или online' });
    }
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Невалидный email' });
    }
    if (!phone || !address) {
      return res.status(400).json({ message: 'phone и address обязательны' });
    }

    const objectIds = items.map((id: string) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: objectIds } });
    // const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Один или несколько товаров не найдены' });
    }

    const sum = products.reduce((acc, prod) => {
      if (prod.price == null) {
        throw new Error(`Товар ${prod.title} не продается`);
      }
      return acc + prod.price;
    }, 0);

    if (sum !== total) {
      return res.status(400).json({ message: `total не совпадает с суммой товаров (${sum})` });
    }

    // ✅ Создание ID заказа
    const orderId = faker.string.uuid();

    res.status(201).json({
      id: orderId,
      total
    });

  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Ошибка создания заказа' });
  }
};
