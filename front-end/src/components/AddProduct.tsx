import { Plus, X } from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { ProductContext } from "../context/ProductContext";

type AddProductType = {
  showAddProduct?: boolean;
  setShowAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddProduct = ({ setShowAddProduct }: AddProductType) => {
  const [productImg, setProductImg] = useState<File | null>(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [img, setImg] = useState<any>(null);

  const { getMenuItems } = useContext(ProductContext);

  const handleAddProductImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0 || !e.target.files) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e) => {
      setImg(e.target?.result);
    };

    setProductImg(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (
        !productImg ||
        !productName ||
        !productDescription ||
        !productCategory ||
        !productPrice
      ) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      if (productPrice === "0" || parseFloat(productPrice) < 0) {
        toast.error("Por favor, insira um preço válido.");
        return;
      }

      const formData = new FormData();
      formData.append("image", productImg as Blob);
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("category", productCategory);
      formData.append("price", productPrice);

      const imageUpload = await fetch("http://localhost:3000/novo-produto", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const imageData = await imageUpload.json();

      if (!imageUpload.ok) {
        throw new Error(imageData.message || "Erro ao adicionar produto.");
      }

      productName === "" && setProductName("");
      productDescription === "" && setProductDescription("");
      productPrice === "" && setProductPrice("");
      productCategory === "" && setProductCategory("");
      productImg === null && setProductImg(null);
      setImg(null);
      setShowAddProduct(false);

      getMenuItems();
      toast.success("Produto adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar produto.");
    }
  };

  return (
    <div className="absolute w-full h-full flex justify-center items-center px-4 md:px-0 text-[#A19D94]">
      <form
        className="w-full md:w-[660px] p-4 bg-[#24201A] border-[#40392F] rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold flex-1 text-center text-md">
            Adicionar produto
          </p>
          <X
            className="cursor-pointer"
            onClick={() => setShowAddProduct(false)}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-2 mb-4">
          {/* Seção para upload */}
          {img ? (
            <div className="relative">
              <img
                src={img ? img : ""}
                className="w-full md:w-[200px] h-[190px] object-cover flex items-center justify-center rounded-md border-1"
              />
              <span
                className="absolute top-2 right-3 cursor-pointer font-bold text-white"
                onClick={() => setImg(null)}
              >
                X
              </span>
            </div>
          ) : (
            <label
              className="w-full md:w-[200px] h-[190px] flex items-center justify-center rounded-md border-1 cursor-pointer border-[#A19D94] text-[#A19D94]"
              htmlFor="product-image"
            >
              <input
                type="file"
                id="product-image"
                className="hidden"
                onChange={(e) => handleAddProductImg(e)}
              />
              <div className="cursor-pointer">
                <Plus />
              </div>
            </label>
          )}

          {/* Inputs */}
          <div className="flex flex-col gap-2 justify-center flex-1 md:px-2 w-full">
            <input
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              placeholder="Nome do produto"
              className="p-2 rounded-md outline-none border-1 border-[#A19D94] text-white placeholder-[#A19D94]"
            />
            <input
              onChange={(e) => setProductDescription(e.target.value)}
              type="text"
              placeholder="Descrição"
              className="p-2 rounded-md outline-none border-1 border-[#A19D94] text-white placeholder-[#A19D94]"
            />
            <select
              className="p-2 rounded-md outline-none border-1 border-[#A19D94] text-white placeholder-[#A19D94] bg-[#24201A]"
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="" selected disabled>
                Categoria
              </option>
              <option value="Hamburger">Hamburger</option>
              <option value="Bebida">Bebida</option>
              <option value="Porção">Porção</option>
            </select>

            <input
              onChange={(e) => setProductPrice(e.target.value)}
              type="number"
              step="0.01"
              placeholder="Preço"
              className="p-2 rounded-md outline-none border-1 border-[#A19D94] text-white placeholder-[#A19D94]"
            />
          </div>
        </div>
        <Button text="Adicionar Produto" />
      </form>
    </div>
  );
};

export default AddProduct;
