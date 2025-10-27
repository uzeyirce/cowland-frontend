// pages/api/metadata/[id].js

// IPFS’teki görsellerin CID'i
const IMAGES_CID = "QmckDumorGLRicEYtzc3BEnsfL6weRND2cZsrtuqJsBRhA";

// 1..9000: common, 9001..9900: bronze, 9901..9990: silver, 9991..9999: gold
function mapToken(tokenId) {
  let type = "common";
  let share = "1/1000";
  let imageFile = "common.png";

  if (tokenId >= 9001 && tokenId <= 9900) {
    type = "bronze"; share = "1/100"; imageFile = "bronze.png";
  } else if (tokenId >= 9901 && tokenId <= 9990) {
    type = "silver"; share = "1/10"; imageFile = "silver.png";
  } else if (tokenId >= 9991 && tokenId <= 9999) {
    type = "gold"; share = "1/1"; imageFile = "gold.png";
  }

  return { type, share, imageFile };
}

export default function handler(req, res) {
  const { id } = req.query;
  const tokenId = parseInt(id, 10);

  if (!Number.isInteger(tokenId) || tokenId < 1 || tokenId > 9999) {
    return res.status(400).json({ error: "invalid token id" });
  }

  const { type, share, imageFile } = mapToken(tokenId);

  const metadata = {
    name: `cowland #${tokenId}`,
    description: `cowland nft - represents ${share} ownership of a real cow.`,
    image: `ipfs://${IMAGES_CID}/${imageFile}`,
    attributes: [
      { trait_type: "type", value: type },
      { trait_type: "share", value: share },
    ],
  };

  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=59");
  return res.status(200).json(metadata);
}

