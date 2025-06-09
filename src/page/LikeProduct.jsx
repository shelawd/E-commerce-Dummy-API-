import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LikedProducts() {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(storedLikes);
  }, []);

  if (likedProducts.length === 0)
    return <p className="text-center mt-10">No liked products.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Liked Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {likedProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
            <p className="text-sm text-gray-600">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LikedProducts;
