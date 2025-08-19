import {Request, Response} from 'express';
import Product from '../models/product';

// GET /product — получить все товары
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении товаров', error: err });
  }
};

// POST /product — создать новый товар
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, image, category, description, price } = req.body;

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
    if (err.code === 11000) { // дубликат уникального поля title
      return res.status(400).json({ message: 'Товар с таким названием уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при создании товара', error: err });
  }
};
