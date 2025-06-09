import React from "react";
import ImgHero from "../assets/Hero.png";
function Hero() {
  return (
    <section id="about-us" className="bg-gradient-to-r py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        {/* Teks Hero */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <p className="text-2xl text-[#4ED7F1] font-semibold">
            Welcome to Happy Shopping!
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#003092]">
            Where Deals Meet Smiles!
          </h1>
          <p className="text-lg mb-6">
            Discover unbeatable prices and handpicked favorites. Shopping made
            joyful, easy, and fast.
          </p>
          <button className="bg-[#FF71CD] text-white font-bold px-6 py-3 rounded-3xl hover:bg-[#e957b6] transition duration-300 cursor-pointer">
            Shop Now
          </button>
        </div>

        {/* Gambar Hero */}
        <div className="md:w-1/2">
          <img src={ImgHero} alt="Hero Image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
