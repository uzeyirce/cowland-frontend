import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x1611DF4f0822487A69E31582deF6cd92772a05F5"; // örn: 0x1611D...
const MINT_PRICE = "0.003";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Metamask yüklü değil!");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  async function mintNFT() {
    try {
      setMinting(true);
      setStatus("işlem gönderiliyor...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const abi = [
        "function mint(uint256 amount) payable",
        "function saleActive() view returns (bool)",
      ];
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.mint(1, {
        value: ethers.parseEther(MINT_PRICE),
      });

      setStatus("blokchain'e yazılıyor...");
      await tx.wait();
      setStatus("✅ başarıyla mint edildi!");
    } catch (err) {
      console.error(err);
      setStatus("❌ hata: " + (err.reason || err.message));
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-green-200 flex flex-col items-center justify-center font-sans text-gray-800 p-6">
      <h1 className="text-5xl font-bold mb-4">🐄 Cowland NFT</h1>
      <p className="text-center max-w-xl mb-8 text-lg">
        Gerçek inek sahipliğini NFT dünyasına taşıyoruz.  
        Her Cowland NFT'si bir inekteki <b>payı</b> temsil eder.  
        Toplam 9999 NFT, 0.003 ETH karşılığında mintlenebilir.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {["common", "silver", "gold", "bronze"].map((name) => (
          <div key={name} className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition">
            <img
              src={`/images/${name}.png`}
              alt={name}
              className="rounded-md mb-2"
            />
            <p className="capitalize text-center font-medium">{name} cow</p>
          </div>
        ))}
      </div>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg"
        >
          Cüzdanı Bağla
        </button>
      ) : (
        <button
          onClick={mintNFT}
          disabled={minting}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg disabled:opacity-50"
        >
          {minting ? "Mintleniyor..." : "Mint NFT"}
        </button>
      )}

      <p className="mt-6 text-md text-gray-700">{status}</p>
      {account && (
        <p className="mt-2 text-sm text-gray-500">
          bağlı: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <footer className="mt-10 text-gray-500 text-sm">
        © 2025 Cowland | turquoiselab.io
      </footer>
    </div>
  );
}

