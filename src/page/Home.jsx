import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";

import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);

  const userId = 1;

  useEffect(() => {
    const fetchProducts = async () => {
      if (query === "") {
        setLoading(true);
        try {
          const endpoint =
            selectedCategory === "all"
              ? "https://dummyjson.com/products"
              : `https://dummyjson.com/products/category/${selectedCategory}`;
          const response = await axios.get(endpoint);
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [query, selectedCategory]);

  // Load cart from localStorage saat halaman pertama kali dibuka
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart && storedCart.products) {
      const totalItems = storedCart.products.reduce(
        (sum, p) => sum + p.quantity,
        0
      );
      setCartCount(totalItems);
    }
  }, []);

  //Kategori
  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(
        `https://dummyjson.com/products/search?q=${query}`
      );

      let filteredProducts = res.data.products;

      if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === selectedCategory
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.log("Error fetching search:", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Hero />

      <div id="product" className=" p-6">
        <div className="max-w-6xl mx-auto mt-6">
          <h1 className="text-4xl font-bold text-center text-[#003092] mb-10 ">
            Our Best Quality Product
          </h1>

          {/* Fitur Search dan Kategori */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mb-8 px-4"
          >
            {/* Select Category */}
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 h-10 text-sm border border-gray-300 text-gray-700 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-gray-100 transition"
            >
              <option value="all">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Input Search */}
            <div className="flex w-full md:flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 text-sm rounded-l-lg border border-gray-300 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-100 transition placeholder-gray-400"
                placeholder="Search for products..."
                required
              />
              <button
                type="submit"
                className="h-10 px-4 text-white bg-gray-700 hover:bg-gray-800 rounded-r-lg border-l border-gray-300 transition flex items-center justify-center cursor-pointer"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Produk */}
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col justify-between h-full"
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[48px]">
                      {product.title}
                    </h3>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-blue-600 font-bold">
                        ${product.price}
                      </span>
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-600">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 bg-[#053262] hover:bg-[#051462] text-white px-4 py-2 rounded cursor-pointer"
                  >
                    + Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              Produk tidak ditemukan.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
