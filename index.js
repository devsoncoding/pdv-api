const express = require('express');
const Brand = require('./src/data/brand');
const Product = require('./src/data/product');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

function createProduct(name, price, description, brand) {
  const timerId = new Date().getTime();
  const brandId = timerId.toString(16);
  const productId = (timerId + (new Date().getMilliseconds())).toString(16);
  const productBrand = Brand(brandId, brand);
  const product = Product(productId, name, price, brandId, description);

  return { product, productBrand };
}

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('It\'s working!'));
app.post('/product', (req, res) => {
  const { name, price, description, brand } = req.body;
  const productAndBrand = createProduct(name, price, description, brand);
  res.json(productAndBrand);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
