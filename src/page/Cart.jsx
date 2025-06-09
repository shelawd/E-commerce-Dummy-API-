import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";

function Cart() {
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart && storedCart.products && storedCart.products.length > 0) {
      setCart(storedCart);
    } else {
      setCart(null);
    }
  }, []);

  // Ubah jumlah produk
  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((product) => {
        if (product.id === productId) {
          const updatedQty = product.quantity + delta;
          return {
            ...product,
            quantity: updatedQty > 1 ? updatedQty : 1, // minimal 1
          };
        }
        return product;
      });
      const updatedCart = { ...prevCart, products: updatedProducts };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Hapus produk dari cart
  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.filter(
        (product) => product.id !== productId
      );
      const updatedCart = { ...prevCart, products: updatedProducts };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      if (updatedProducts.length === 0) {
        localStorage.removeItem("cart");
        return null;
      }
      return updatedCart;
    });

    // Hapus dari daftar selected juga jika sedang dicentang
    setSelectedItems((prevSelected) =>
      prevSelected.filter((id) => id !== productId)
    );
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleCheckout = () => {
    const selectedProducts = cart.products.filter((p) =>
      selectedItems.includes(p.id)
    );

    if (selectedProducts.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    navigate("/checkout");
  };

  if (!cart)
    return (
      <div className=" flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold mb-4">Your cart is empty.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Homepage
        </Link>
      </div>
    );

  const totalProducts = cart.products.reduce((acc, item) => {
    return selectedItems.includes(item.id) ? acc + item.quantity : acc;
  }, 0);

  const totalPrice = cart.products.reduce((acc, item) => {
    return selectedItems.includes(item.id)
      ? acc + item.price * item.quantity
      : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛒 Products in Your Cart
      </h1>

      <ul>
        {cart.products.map((product) => (
          <li
            key={product.id}
            className="py-4 flex items-center justify-between border-b border-gray-200"
          >
            <div className="flex items-center gap-4 w-full">
              <input
                type="checkbox"
                checked={selectedItems.includes(product.id)}
                onChange={() => handleCheckboxChange(product.id)}
              />
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition"
                />
              </Link>
              <div className="flex-1">
                <p className="font-semibold">{product.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right font-bold w-32">
                ${(product.price * product.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="ml-4 text-red-600 hover:underline cursor-pointer"
              >
                <IoTrashOutline size={24} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 font-bold text-right">
        Total Products: {totalProducts} <br />
        Total Price: ${totalPrice.toFixed(2)}
      </div>

      <div className="text-right mt-4">
        <button
          onClick={handleCheckout}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
