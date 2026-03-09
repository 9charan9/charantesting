export const sortProducts = (products, type) => {
  return [...products].sort((a, b) => {
    if (type === "price") return a.price - b.price;
    if (type === "name") return a.title.localeCompare(b.title);
    return 0;
  });
};
