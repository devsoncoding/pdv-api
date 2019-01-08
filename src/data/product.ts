const Product = (
  id: string,
  name: string,
  price: number,
  brandId: string,
  description?: string,
) => ({ id, name, price, brandId, description });

export default Product;
