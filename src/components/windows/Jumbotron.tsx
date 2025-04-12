import { useState, useEffect } from 'react';

const Jumbotron = () => {
  const [announcement, setAnnouncement] = useState("WELCOME TO KANA'S STADIUM!");

  useEffect(() => {
    const announcements = [
      "WELCOME TO KANA'S STADIUM!",
      "CHECK OUT OUR LATEST PROJECTS!",
      "THANKS FOR VISITING!",
      "MAKE SOME NOISE!",
      "LET'S GO DODGERS!",
    ];

    const interval = setInterval(() => {
      const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
      setAnnouncement(randomAnnouncement);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col font-ms-sans">
      <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue">Dodgers Legendary Moments</h2>

      <div className="mb-2 sm:mb-4 bg-black text-yellow-300 font-pixel text-lg sm:text-xl p-2 text-center animate-blink">
        {announcement}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="win95-inset p-1 sm:p-2 flex-1 mb-2">
          <div className="h-full relative">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/videoseries?si=Q1GGufncqXn4H70B&amp;controls=0&amp;list=PL38PovI3ABXaVNj5kYIMswiWr8h1bY82a"
              title="Dodgers Legendary Moments"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              playsinline
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
