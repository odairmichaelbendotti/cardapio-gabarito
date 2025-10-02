export const priceFormatter = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(price);

  return formattedPrice;
};
