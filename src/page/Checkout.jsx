import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function Checkout() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    paymentMethod: "credit_card",
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    if (storedItems.length === 0) {
      navigate("/cart");
    }
    setItems(storedItems);
  }, [navigate]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInput = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Hanya angka untuk phone & zip
    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 13);
    }
    if (name === "zip") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    // Hanya huruf dan spasi untuk name, city, country
    if (["name", "city", "country"].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s]/g, ""); // hapus selain huruf dan spasi
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmPayment = window.confirm(
      "Are you sure you want to proceed with this payment?"
    );
    if (!confirmPayment) return;

    const checkoutHistory =
      JSON.parse(localStorage.getItem("checkoutHistory")) || [];
    const newEntry = {
      id: Date.now(),
      items,
      formData,
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [...checkoutHistory, newEntry];
    localStorage.setItem("checkoutHistory", JSON.stringify(updatedHistory));

    setSuccess(true);
    localStorage.removeItem("checkoutItems");
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!success) {
        e.preventDefault();
        e.returnValue = ""; // standar untuk memicu dialog konfirmasi
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [success]);

  // Untuk konfirmasi navigasi internal React Router (misal klik tombol Back)
  const handleNavigateAway = (path) => {
    if (
      !success &&
      !window.confirm("Are you sure you want to leave? Your data will be lost.")
    ) {
      return;
    }
    navigate(path);
  };

  if (success) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-green-50 to-green-100 px-6">
        <h1 className="text-4xl font-extrabold mb-6 text-green-700 drop-shadow-md">
          ✅ Payment Successful!
        </h1>
        <p className="mb-8 text-gray-700 max-w-md leading-relaxed">
          Thank you for shopping with us. Your order has been processed
          successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 font-semibold"
        >
          Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Checkout
      </h1>

      {/* tombol navigasi handler konfirmasi */}

      <button
        onClick={() => handleNavigateAway("/cart")}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer mb-5"
      >
        <FiArrowLeft size={20} />
        Back to Cart
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Steps and Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Payment Method
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === "credit_card"}
                  onChange={handleInput}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Credit Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleInput}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">PayPal</span>
              </label>
            </div>
          </div>

          {/* Shipping Details */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Card Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telephone"
                value={formData.phone}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={formData.zip}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 border rounded h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-[#053262] hover:bg-[#051462] text-white rounded  transition font-semibold cursor-pointer"
            >
              Pay Now
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Order Summary
          </h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="text-gray-800 font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-gray-800 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping Fee</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>$2.50</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg mt-4">
              <span>Total</span>
              <span>${(total + 5 + 2.5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
