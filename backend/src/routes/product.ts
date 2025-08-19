import {Router} from 'express';
import {createProduct, getProducts} from '../controllers/products';

const router = Router();

router.get('/product', getProducts);
router.post('/product', createProduct);

export default router;
