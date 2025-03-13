import { useState } from "react";
import { useWindowStore, WindowId } from "@/utils/windowUtils";

interface WindowItem {
  id: WindowId;
  name: string;
  description: string;
  icon: string;
}

const windows: WindowItem[] = [
  { id: "radio", name: "Stadium FM", description: "Listen to live game commentary and classic baseball tunes.", icon: "/images/baseball_radio_icon.png" },
  { id: "baseballCard", name: "Baseball Card", description: "Check out my profile and professional information.", icon: "/images/baseball_card_icon.png" },
  { id: "scoreboard", name: "Scoreboard", description: "View player statistics and live game updates.", icon: "/images/scoreboard_icon.png" },
  { id: "jumbotron", name: "Jumbotron", description: "Watch some of the best MLB team's legendary moments in history", icon: "/images/jumbotron_icon.png" },
  { id: "guestbook", name: "Guestbook", description: "Sign the guestbook and leave a message for other visitors.", icon: "/images/guestbook_icon.png" }
];

const StadiumMap = () => {
  const [selectedWindow, setSelectedWindow] = useState<WindowItem | null>(null);
  const { openWindow } = useWindowStore();

  const handleWindowClick = (window: WindowItem) => {
    setSelectedWindow(window);
  };

  return (
    <div className="w-[600px] h-full bg-cover bg-center relative" style={{ backgroundImage: `url('/images/pixel_stadium_back.png')` }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-60 p-3 text-white text-lg font-bold text-center">
        Stadium Map
      </div>

      {/* Interactive Windows */}
      <div className="absolute bottom-8 left-0 right-0 bg-black bg-opacity-80 p-4 flex justify-center gap-6">
        {windows.map((win) => (
          <button
            key={win.id}
            className="text-white flex flex-col items-center hover:opacity-80 transition-opacity"
            onClick={() => handleWindowClick(win)}
          >
            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
              <img src={win.icon} alt={win.name} className="w-10 h-10" />
            </div>
            <span className="mt-2 text-sm">{win.name}</span>
          </button>
        ))}
      </div>

      {/* Window Description */}
      {selectedWindow && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 text-white p-6 rounded-lg shadow-lg">
          <div className="text-center w-full max-w-4xl p-8">
            <h3 className="text-xl font-bold">{selectedWindow.name}</h3>
            <p className="mt-2 text-sm">{selectedWindow.description}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700"
                onClick={() => {
                  openWindow(selectedWindow.id);
                  setSelectedWindow(null);
                }}
              >
                Open Window
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded text-sm hover:bg-red-600"
                onClick={() => setSelectedWindow(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadiumMap;
