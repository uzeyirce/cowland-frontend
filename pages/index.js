import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [minted, setMinted] = useState(0);
  const totalSupply = 9999;
  const [isMinting, setIsMinting] = useState(false);

  const cows = [
    { id: 1, name: "Legendary Cow", rarity: "Legendary", count: 9, image: "/images/gold.png" },
    { id: 2, name: "Epic Cow", rarity: "Epic", count: 90, image: "/images/silver.png" },
    { id: 3, name: "Rare Cow", rarity: "Rare", count: 900, image: "/images/common.png" },
    { id: 4, name: "Common Cow", rarity: "Common", count: 9000, image: "/images/bronze.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMinted((prev) => (prev < totalSupply ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMint = async () => {
    setIsMinting(true);
    setTimeout(() => {
      setMinted((m) => (m < totalSupply ? m + 1 : m));
      setIsMinting(false);
    }, 2000);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#f9fafb] to-[#eef3f8] text-gray-800 p-6"
      style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive, sans-serif" }}
    >
      <h1 className="text-4xl font-bold mt-8 mb-4 text-center text-[#2c3e50] drop-shadow-sm">
        🐮 Cowland NFT Mint
      </h1>

      <button
        onClick={handleMint}
        disabled={isMinting}
        className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMinting ? "Minting..." : "Mint Now"}
      </button>

      <p className="mt-4 text-lg font-medium text-gray-700">
        Minted: <span className="font-bold">{minted}</span> / {totalSupply}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10 w-full max-w-5xl">
        {cows.map((cow) => (
          <div
            key={cow.id}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 hover:shadow-2xl transition-shadow duration-200 border border-gray-200"
          >
            <img
              src={cow.image}
              alt={cow.name}
              className="w-48 h-48 object-cover rounded-xl border-2 border-gray-300"
            />
            <h2 className="mt-3 text-xl font-bold text-[#2f3640]">{cow.name}</h2>
            <p className="text-md text-gray-600 mt-1">{cow.count} {cow.rarity}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

