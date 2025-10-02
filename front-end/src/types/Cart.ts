export type CartItemType = {
  id: string;
  product: ProductType;
  productId: string;
  quantity: number;
  userId: string;
};

type ProductType = {
  id: string;
  img: string;
  name: string;
  price: number;
  description: string;
};
