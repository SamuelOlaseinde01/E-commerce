import React from "react";
import { Link } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function ProductCard({ product }) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Link to={product._id} className="product-container">
      {!loaded && (
        <div className="spinner">
          <BounceLoader color="grey" size={30} />
        </div>
      )}
      <img
        src={product.image}
        alt={product.title}
        onLoad={() => setLoaded(true)}
        style={loaded ? { opacity: 1 } : { opacity: 0 }}
      />
      <p className="title">{product.title}</p>
      <h3 className="price">${product.price}</h3>
    </Link>
  );
}
