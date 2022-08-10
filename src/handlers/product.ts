import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from './helpers';

const productStore = new ProductStore();

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products: Product[] = await productStore.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name as unknown as string;
    const price = req.body.price as unknown as number;

    if (!name || !price) {
      res.status(400);
      res.send('Some required parameters are missing! eg. :name, :price');
      return false;
    }
    const product: Product = await productStore.create({ name, price });
    res.json({
      product,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }
    const product: Product = await productStore.read(id);
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    const name = req.body.name as unknown as string;
    const price = req.body.price as unknown as number;
    if (!name || !price || !id) {
      res.status(400);
      res.send('Some required parameters are missing! eg. :name, :price, :id');
      return false;
    }
    const product: Product = await productStore.update(id, {
      name,
      price,
    });

    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (!id) {
      res.status(400);
      res.send('Missing required parameter :id.');
      return false;
    }
    await productStore.deleteProduct(id);
    res.send(`Product with id ${id} successfully deleted.`);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

export default function productRoutes(app: Application) {
  app.get('/products', getAllProduct);
  app.post('/products/create', verifyToken, create);
  app.get('/products/:id', read);
  app.put('/products/:id', verifyToken, update);
  app.delete('/products/:id', verifyToken, deleteProduct);
}
