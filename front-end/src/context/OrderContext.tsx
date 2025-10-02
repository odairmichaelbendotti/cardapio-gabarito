import { createContext, useState, type ReactNode } from "react";

type OrderType = {
  id: number;
  total: number;
  createdAt: Date;
  status: string;
  qtd: number;
  entrega: any;
  deliveredAt: Date;
  username: string;
};

type OrderContextType = {
  orders: OrderType[] | [];
  setOrder: React.Dispatch<React.SetStateAction<OrderType[] | []>>;
  getOrders: () => void;
};

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  setOrder: () => {},
  getOrders: () => {},
});

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrder] = useState<OrderType[] | []>([]);

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-orders", {
        credentials: "include",
      });

      const data = (await response.json()) as OrderType[];
      setOrder(data);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, setOrder, getOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
