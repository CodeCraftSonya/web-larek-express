import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    if (!title || title.length < 2 || title.length > 30) {
      return next(new BadRequestError('Некорректное название товара'));
    }

    const existing = await Product.findOne({ title });
    if (existing) {
      return next(new ConflictError('Товар с таким title уже существует'));
    }

    const newProduct = new Product({
      title,
      image,
      category,
      description,
      price,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err: any) {
    if (err.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    next(err);
  }
};
