import { useContext, useEffect, useState } from "react";
import CardPedido from "../components/CardPedido";
import { OrderContext } from "../context/OrderContext";
import { priceFormatter } from "../utils/price-formatter";

const Pedidos = () => {
  const [selectedItem, setSelectedItem] = useState("Pendentes");
  const { orders, getOrders } = useContext(OrderContext);
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const changeOrderStatus = async (id: number, novoStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/order-status/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await response.json();
      console.log(data);
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const selectClass = (item: string) => {
    const active =
      "bg-[#f2daac] font-bold w-[100px] py-1 md:py-2 md:w-32 text-sm md:text-md text-center rounded-md cursor-pointer border-2 border-[#f2daac] text-[#161410]";

    const inactive =
      "bg-[#161410] font-bold w-[100px] py-1 md:py-2 md:w-32 text-sm md:text-md text-center rounded-md cursor-pointer border-2 border-[#f2daac] text-[#f2daac]";

    if (item === selectedItem) {
      return active;
    } else {
      return inactive;
    }
  };

  // NÃO DEU PROBLEMA AQUI
  useEffect(() => {
    if (selectedItem === "Pendentes") {
      const pendentes = orders.filter((order) => order.status === "Pendente");
      setFilteredOrders(pendentes);
    }

    if (selectedItem === "Retirados") {
      const retirados = orders.filter((order) => order.status === "Retirado");
      setFilteredOrders(retirados);
    }

    if (selectedItem === "Cancelados") {
      const cancelados = orders.filter((order) => order.status === "Cancelado");
      setFilteredOrders(cancelados);
    }
  }, [orders, selectedItem]);

  useEffect(() => {
    getOrders();
    console.log(orders);
  }, []);

  return (
    <div className="w-full mt-4 text-center text-[#F2DAAC] font-bold px-4 md:px-0">
      <div className="flex items-center gap-3">
        <div
          className={selectClass("Pendentes")}
          onClick={() => setSelectedItem("Pendentes")}
        >
          Pendentes
        </div>
        <div
          className={selectClass("Retirados")}
          onClick={() => setSelectedItem("Retirados")}
        >
          Retirados
        </div>
        <div
          className={selectClass("Cancelados")}
          onClick={() => setSelectedItem("Cancelados")}
        >
          Cancelados
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {filteredOrders.map((order) => (
          <CardPedido
            key={order.id}
            id={order.id}
            cliente={order.username}
            status={order.status}
            createdAt={order.createdAt}
            deliveredAt={order.entrega}
            price={priceFormatter(order.total)}
            changeOrderStatus={changeOrderStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
