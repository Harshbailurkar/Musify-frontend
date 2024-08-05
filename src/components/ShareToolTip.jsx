import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function ShareToolTip({ link, Close }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [QRUrl, setQRUrl] = useState(null);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };
  useEffect(() => {
    QRGenerate();
  }, []);

  const QRGenerate = async () => {
    const imageSource = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${link}`;
    const data = await fetch(imageSource);
    const response = await data.blob();
    const url = URL.createObjectURL(response);
    setQRUrl(url);
  };

  return (
    <div className="flex flex-col w-72 relative  bg-gray-950 border border-gray-500 text-white p-4 rounded shadow-lg items-center">
      <button
        onClick={Close}
        className="absolute top-1 right-2 text-white hover:text-gray-300 focus:outline-none text-2xl pt-1 mb-2"
      >
        &times;
      </button>
      <button
        className="border border-gray-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mb-2 w-3/4 mt-2"
        onClick={handleCopyLink}
      >
        {!copied ? "Copy Link" : "Copied"}
      </button>
      <button
        className="border border-gray-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded w-3/4"
        onClick={toggleQR}
      >
        {showQR ? "Hide QR Code" : "Share via QR Code"}
      </button>
      {showQR && (
        <div className="qr-code mt-4">
          <img src={QRUrl} alt="" />
        </div>
      )}
    </div>
  );
}
