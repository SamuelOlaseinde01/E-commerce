import React from "react";
import { getProducts } from "./user-api";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

export async function loader({ request }) {
  let search = new URL(request.url).searchParams.get("search");
  if (!search) {
    search = "";
  }
  const products = await getProducts(search);
  return products.products;
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function Products() {
  const products = useLoaderData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedSearch) {
      navigate(`/products/?search=${debouncedSearch}`);
    } else {
      navigate("/products");
    }
  }, [debouncedSearch, navigate]);

  return (
    <>
      <h1>Products</h1>
      <input
        type="text"
        name="productName"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!products && products.success === false && (
        <h3 style={{ color: "red" }}>No products found</h3>
      )}
      <div className="products-container">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  );
}
