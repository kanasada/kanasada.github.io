import React from 'react';

const Guestbook = () => {
  return (
    <div className="h-full flex flex-col font-ms-sans p-4">
      <h2 className="text-base sm:text-lg font-bold mb-4 text-blue-800">Contact Information</h2>
      <div className="win95-inset bg-white p-4 border border-gray-300 rounded">
      <div className="mb-2">
          <span className="font-bold text-blue-800">Email:</span> <a href="mailto:kanabsadahiro@gmail.com" className="text-blue-600 underline">kanabsadahiro@gmail.com</a>
        </div>
        <div className="mb-2">
          <span className="font-bold text-blue-800">Instagram:</span> <a href="https://instagram.com/kana.sadahiro" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">kana.sadahiro</a>
        </div>
        <div className="mb-2">
          <span className="font-bold text-blue-800">X.com:</span> <a href="https://x.com/Kana_Sadahiro" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Kana_Sadahiro</a>
        </div>
        <div className="mb-2">
          <span className="font-bold text-blue-800">GitHub:</span> <a href="https://github.com/kanasada" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">@kanasada</a>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
