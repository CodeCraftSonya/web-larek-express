import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().allow(null),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().required()).min(1).required(),
  }),
});
