import React from "react";
import { addToCart, getProduct } from "./user-api";
import { Form, useLoaderData } from "react-router-dom";

export async function loader({ params }) {
  const { product } = await getProduct(params.id);
  return product;
}

export async function action({ request }) {
  const formData = await request.formData();
  const quantity = formData.get("quantity");
  const product = formData.get("productId");

  const isLoggedIn = localStorage.getItem("userToken");

  if (!isLoggedIn) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((item) => item.product === product);
    if (existingIndex > -1) {
      cart[existingIndex].quantity = quantity;
    } else {
      cart.push({ quantity, product });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  if (isLoggedIn) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ quantity, product });
    await addToCart(cart);
  }

  return null;
}

export default function Product() {
  const product = useLoaderData();
  return (
    <div className="only-product-container">
      <h1>{product.title}</h1>
      <h4>DESCRIPTION</h4>
      <p>{product.description}</p>
      <h4>PRICE</h4>
      <h1>{product.price}</h1>
      <Form method="POST">
        <label htmlFor="number">QUANTITY</label>
        <input type="number" name="quantity" id="number" min={1} />
        <input
          type="hidden"
          name="productId"
          value={product._id}
          inputMode="numeric"
        />
        <button>ADD TO CART</button>
      </Form>
      <img src={product.image} alt={product.title} srcset="" />
    </div>
  );
}
