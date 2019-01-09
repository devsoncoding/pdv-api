import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

const BrandSchema = new mongoose.Schema({
  name: String,
});
const BrandModel = mongoose.model("brands", BrandSchema);

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  brandId: String,
  description: String,
});
const ProductModel = mongoose.model("products", ProductSchema);

type ProductDocument = mongoose.Document & {
  name: string,
  price: number,
  brandId: string,
  description?: string,
}

function connect(): Promise<mongoose.Connection> {
  return new Promise(resolve => {
    if (!process.env.MONGODB_URL)
      throw new Error('There\'s no database URL connection available');

    mongoose.connect(process.env.MONGODB_URL, err => {
      if (!!err) {
        console.error("connection failure", err);
        throw err;
      }
      else {
        console.log("connected");
        resolve(mongoose.connection);
      }
    });
  });
}

async function getOrSaveBrand(name: string): Promise<mongoose.Document> {
  return new Promise(resolve => {
    BrandModel.findOne({ name }, async (err: any, brandDocument: mongoose.Document) => {
      if (!err && !!brandDocument) {
        console.log("brand found", { brandDocument, err });
        resolve(brandDocument);
        return;
      }

      console.warn("brand not found", { name, err });

      const brandModel = new BrandModel({ name });
      const brandItem = await brandModel.save();
      console.log("brand saved", { brandItem });
      resolve(brandItem);
    });
  });
}

async function createProduct(name: string, price: number, brand: string, description?: string) {
  const db = await connect();
  const brandItem = await getOrSaveBrand(brand);
  const productModel = new ProductModel({
    name: name,
    price: price,
    brandId: brandItem._id,
    description: description,
  });
  const productItem = await productModel.save() as ProductDocument;

  db.close();
  return productItem;
};

app.use(bodyParser.json());

app.get('/', (_, res) => res.send('It\'s working!'));
app.post('/product', async (req, res) => {
  const { name, price, description, brand } = req.body;
  createProduct(name, price, brand, description)
    .then(product => res.json({ product }))
    .catch(reason => res.json({ error: reason }))
});

// @ts-ignore
app.listen();
