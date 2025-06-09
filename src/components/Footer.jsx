import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 ">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Happy Shopping. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
