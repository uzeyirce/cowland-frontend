import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x1611DF4f0822487A69E31582deF6cd92772a05F5";
const CONTRACT_ABI = [
  "function mint(uint256 amount) public payable",
  "function totalMinted() public view returns(uint256)",
  "function saleActive() public view returns(bool)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState("");
  const [totalMinted, setTotalMinted] = useState(0);

  async function connect() {
    if (!window.ethereum) return alert("Metamask gerekli!");
    const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWallet(addr);
    await updateTotalMinted();
  }

  async function updateTotalMinted() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, await provider.getSigner());
    const count = await contract.totalMinted();
    setTotalMinted(Number(count));
  }

  async function mintNFT() {
    if (!wallet) return alert("Cüzdan bağlı değil");
    setMinting(true);
    setStatus("Mint başlatılıyor...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.mint(1, { value: ethers.parseEther("0.003") });
      await tx.wait();
      setStatus("✅ Mint başarılı!");
      await updateTotalMinted();
    } catch (err) {
      console.error(err);
      setStatus("❌ Hata: " + err.message);
    }

    setMinting(false);
  }

  return (
    <main style={{ textAlign: "center", padding: "60px" }}>
      <h1>Cowland 🐮 NFT Mint</h1>

      {!wallet ? (
        <button onClick={connect}>🔗 Cüzdanı Bağla</button>
      ) : (
        <p>Bağlı: {wallet}</p>
      )}

      <p>Toplam Mintlenen: {totalMinted} / 9999</p>

      <button onClick={mintNFT} disabled={minting}>
        {minting ? "Mintleniyor..." : "Mint Et (0.003 ETH)"}
      </button>

      <p style={{ marginTop: "20px" }}>{status}</p>
    </main>
  );
}

