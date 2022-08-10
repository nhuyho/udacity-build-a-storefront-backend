import { BaseProduct, Product, ProductStore } from '../../models/product';

const productStore = new ProductStore();

describe('Product Model', () => {
  const product: BaseProduct = {
    name: 'Mono',
    price: 2000,
  };

  async function createProduct(product: BaseProduct) {
    return productStore.create(product);
  }

  async function deleteProduct(id: number) {
    return productStore.deleteProduct(id);
  }

  it('should have an index method', () => {
    expect(productStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(productStore.read).toBeDefined();
  });

  it('should have a add method', () => {
    expect(productStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(productStore.deleteProduct).toBeDefined();
  });

  it('add method should add a product', async () => {
    const createdProduct: Product = await createProduct(product);
    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product,
    });
    await deleteProduct(createdProduct.id);
  });

  it('index method should return a list of products', async () => {
    const createdProduct: Product = await createProduct(product);
    const productList = await productStore.index();
    expect(productList).toEqual([createdProduct]);
    await deleteProduct(createdProduct.id);
  });

  it('show method should return the correct product', async () => {
    const createdProduct: Product = await createProduct(product);
    const productData = await productStore.read(createdProduct.id);
    expect(productData).toEqual(createdProduct);
    await deleteProduct(createdProduct.id);
  });

  it('update method should update the product', async () => {
    const createdProduct: Product = await createProduct(product);
    const newProduct: BaseProduct = {
      name: 'New Product List',
      price: 2423,
    };
    const { name, price } = await productStore.update(
      createdProduct.id,
      newProduct
    );
    expect(name).toEqual(newProduct.name);
    expect(price).toEqual(newProduct.price);
    await deleteProduct(createdProduct.id);
  });

  it('delete method should remove the product', async () => {
    const createdProduct: Product = await createProduct(product);
    await deleteProduct(createdProduct.id);
    const productList = await productStore.index();
    expect(productList).toEqual([]);
  });
});
