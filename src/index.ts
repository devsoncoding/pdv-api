import express from 'express';
import BodyParser from 'body-parser';
import Brand from './data/brand';
import Product from './data/product';
const app = express();

function createProduct(name: string, price: number, brand: string, description?: string) {
  const timerId = new Date().getTime();
  const brandId = timerId.toString(16);
  const productId = (timerId + (new Date().getMilliseconds())).toString(16);
  const productBrand = Brand(brandId, brand);
  const product = Product(productId, name, price, brandId, description);

  return { product, productBrand };
}

app.use(BodyParser.json());

app.get('/', (_, res) => res.send('It\'s working!'));
app.post('/product', (req, res) => {
  const { name, price, description, brand } = req.body;
  const { product, productBrand } = createProduct(name, price, brand, description);
  const secrets = { login: process.env.LOGIN, password: process.env.PASSWORD };
  console.log(secrets)
  res.json({ product, productBrand, secrets });
});

// @ts-ignore
app.listen();
