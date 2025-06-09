import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { MdShoppingCartCheckout } from "react-icons/md";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error:", err));
  }, [id]);

  useEffect(() => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || [];
    const isLiked = likedProducts.some((p) => p.id === parseInt(id));
    setLiked(isLiked);
  }, [id]);

  // Menampilkan rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    while (stars.length < 5) {
      stars.push(
        <FaRegStar key={`empty-${stars.length}`} className="text-yellow-500" />
      );
    }
    return stars;
  };

  // Fungsi tambah produk ke cart (localStorage)
  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));

    if (!storedCart) {
      // Kalau belum ada cart, buat baru
      const newCart = {
        userId: userId,
        products: [{ ...product, quantity: 1 }],
      };
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCartCount(1);
      alert("Berhasil menambahkan produk ke cart!");
    } else {
      // Kalau sudah ada cart, update
      const productInCart = storedCart.products.find(
        (p) => p.id === product.id
      );

      let updatedProducts;
      if (productInCart) {
        // Update quantity
        updatedProducts = storedCart.products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        // Tambah produk baru
        updatedProducts = [...storedCart.products, { ...product, quantity: 1 }];
      }

      const updatedCart = {
        ...storedCart,
        products: updatedProducts,
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      const totalItems = updatedProducts.reduce(
        (sum, p) => sum + p.quantity,
        0
      );
      setCartCount(totalItems);

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Berhasil menambahkan produk ke cart!");
    }
  };

  // Fungsi untuk langsung checkout produk ini
  const checkoutProduct = (product) => {
    // Simpan produk ke localStorage sebagai checkoutItems (hanya 1 produk ini)
    const checkoutItems = [{ ...product, quantity: 1 }]; // Atur quantity sesuai kebutuhan
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));

    // Redirect ke halaman checkout
    navigate("/checkout");
  };

  // Fungsi untuk simpan produk yg disukai
  const toggleLike = (product) => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || [];
    const isLiked = likedProducts.find((p) => p.id === product.id);

    let updatedLikes;
    if (isLiked) {
      // Hapus dari liked
      updatedLikes = likedProducts.filter((p) => p.id !== product.id);
      setLiked(false);
    } else {
      // Tambah ke liked
      updatedLikes = [...likedProducts, product];
      setLiked(true);
    }

    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 bg-white rounded-xl">
      {/* Left: Image Section */}
      <div>
        <img
          src={selectedImage || product.thumbnail}
          alt={product.title}
          className="w-full h-[400px] object-cover rounded-xl"
        />

        <div className="flex mt-4 gap-2 overflow-x-auto">
          {product.images?.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover rounded border cursor-pointer transition ${
                selectedImage === img ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
          {product.images?.length > 4 && (
            <div className="w-20 h-20 flex items-center justify-center text-sm bg-gray-100 rounded border text-gray-600">
              +{product.images.length - 4} more
            </div>
          )}
        </div>
      </div>

      {/* Right: Info Section */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            {product.title}
          </h1>

          <p className="italic text-sm text-gray-500 mb-3">
            Brand:{" "}
            <span className="not-italic font-medium">{product.brand}</span>
          </p>

          <div className="flex items-center text-sm text-gray-600 mb-4 gap-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-700 font-medium">
              ({product.rating.toFixed(1)} Rating)
            </span>
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-sm text-red-600 font-semibold mb-2">
              Discount: {product.discountPercentage}% OFF
            </p>
          )}

          <p className="text-3xl font-extrabold text-gray-900 mb-2">
            ${product.price}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-700">Stock:</span>
            <span
              className={`text-sm px-2 py-1 rounded-full font-medium ${
                product.stock > 10
                  ? "bg-green-100 text-green-700"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock}
            </span>
          </div>

          <p
            className={`text-sm font-semibold mb-4 px-2 py-1 w-fit rounded-md ${
              {
                "In Stock": "bg-green-100 text-green-800",
                "Low Stock": "bg-yellow-100 text-yellow-800",
                "Out of Stock": "bg-red-100 text-red-800",
              }[product.availabilityStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            Status: {product.availabilityStatus}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 bg-white text-[#053262] border border-[#053262] hover:bg-[#051462] hover:text-white px-4 py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              <FaCartPlus /> Add to cart
            </button>

            <button
              onClick={() => checkoutProduct(product)}
              className="flex items-center gap-2 bg-[#053262] text-white hover:bg-[#051462] px-4 py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              <MdShoppingCartCheckout />
              Checkout
            </button>

            <button
              onClick={() => toggleLike(product)}
              className="w-12 h-12 flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg hover:border-black transition duration-200"
            >
              {liked ? (
                <FaHeart className="text-pink-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-600 text-lg" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 italic">
            Free delivery on orders over{" "}
            <span className="font-medium">$30.00</span>
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="md:col-span-2 mt-10">
        <div className="flex gap-6 border-b mb-6 text-sm font-semibold ">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-2 cursor-pointer ${
              activeTab === "details"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 cursor-pointer ${
              activeTab === "reviews"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Konten Berdasarkan Tab Aktif */}
        {activeTab === "details" && (
          <div>
            {/* Deskripsi */}
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

            {/* Info Tambahan */}
            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <p>
                <strong>SKU:</strong> {product.sku || "RZK-210"}
              </p>
              <p>
                <strong>Weight:</strong> {product.weight || 900} g
              </p>
              <p>
                <strong>Dimensions:</strong> {product.dimensions?.width || 32} x{" "}
                {product.dimensions?.height || 12} x{" "}
                {product.dimensions?.depth || 10} cm
              </p>
              <p>
                <strong>Shipping:</strong>{" "}
                {product.shippingInformation ||
                  "Free delivery on orders over $30.00"}
              </p>
              <p>
                <strong>Warranty:</strong>{" "}
                {product.warrantyInformation || "1-year manufacturer warranty"}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                {product.availabilityStatus || "In Stock"}
              </p>
              <p>
                <strong>Return Policy:</strong>{" "}
                {product.returnPolicy || "30-day return policy"}
              </p>
              <p>
                <strong>Minimum Order:</strong>{" "}
                {product.minimumOrderQuantity || 1}
              </p>
              <p>
                <strong>Barcode:</strong>{" "}
                {product.meta?.barcode || "987654321098"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Customer Reviews
            </h2>
            {product.reviews?.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span>({product.rating.toFixed(1)})</span>
                  </div>

                  <p className="text-gray-600 italic">"{review.comment}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    — {review.reviewerName},{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
