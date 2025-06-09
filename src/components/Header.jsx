import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart, FaHistory } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart"));
      if (storedCart && storedCart.products) {
        const totalItems = storedCart.products.reduce(
          (sum, p) => sum + p.quantity,
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    // Panggil pertama kali saat mount
    updateCartCount();

    // Dengarkan event global dari halaman lain
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white px-6 h-24">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/src/assets/Logo2.png"
            alt="Logo"
            className="w-36 object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-lg font-medium text-[#053262]">
          <a href="#product" className="hover:text-[#FF71CD] transition-colors">
            Products
          </a>

          <a
            href="#about-us"
            className="hover:text-[#FF71CD] transition-colors"
          >
            About Us
          </a>
        </nav>

        {/* Icon Actions */}
        <div className="flex items-center gap-5 text-[#053262] text-xl">
          <Link
            to="/liked"
            className="flex items-center justify-center relative hover:text-[#FF71CD] transition-colors"
          >
            <FaHeart />
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center justify-center hover:text-[#FF71CD] transition-colors"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/history"
            className="flex items-center justify-center hover:text-[#FF71CD] transition-colors"
          >
            <FaHistory className="inline mr-1" />
          </Link>
          {/* Profile Dropdown */}
          <div
            className="flex items-center justify-center relative "
            ref={dropdownRef}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-[#FF71CD] transition-colors cursor-pointer"
            >
              <FaUser />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-24 w-32 bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>{" "}
        </div>
      </div>
    </header>
  );
}

export default Header;
