import { useContext, useEffect, useState } from "react";
import Item from "../components/Item";
import { ProductContext } from "../context/ProductContext";
import type { Product } from "../types/Product";

const Cardapio = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>("Hamburger");
  const [showMenuItems, setShowMenuItems] = useState<Product[] | []>([]);

  const { menuItems, getMenuItems } = useContext(ProductContext);

  const categories = ["Hamburger", "Bebida", "Porção"];

  useEffect(() => {
    getMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      filterMenuItems();
    }
  }, [selectedItem, menuItems]);

  const filterMenuItems = () => {
    const filteredItems = menuItems.filter(
      (item) => item.category === selectedItem
    );
    setShowMenuItems(filteredItems);
  };

  const selectClass = (item: string) => {
    const active =
      "bg-[#f2daac] font-bold w-[100px] py-1 md:py-2 md:w-32 text-sm md:text-md text-center rounded-md cursor-pointer border-2 border-[#f2daac]";

    const inactive =
      "bg-[#161410] font-bold w-[100px] py-1 md:py-2 md:w-32 text-sm md:text-md text-center rounded-md cursor-pointer border-2 border-[#f2daac] text-[#f2daac]";

    if (item === selectedItem) {
      return active;
    } else {
      return inactive;
    }
  };

  return (
    <div className="mt-4 px-3 md:px-0">
      <div className="flex gap-3">
        {categories.map((category) => (
          <div
            key={category}
            className={selectClass(category)}
            onClick={() => setSelectedItem(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {menuItems.length > 0 ? (
          showMenuItems.map((item) => (
            <Item
              title={item.name}
              description={item.description}
              key={item.id}
              id={item.id}
              price={item.price}
              img={item.img}
              getMenuItems={getMenuItems}
            />
          ))
        ) : (
          <p className="text-[#848484] text-center">Cardápio vazio</p>
        )}
      </div>
    </div>
  );
};

export default Cardapio;
