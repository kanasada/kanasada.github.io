
import { useEffect, useState } from 'react';
import { useWindowStore, WindowId } from '@/utils/windowUtils';
import Window from '@/components/Window';
import Scoreboard from '@/components/windows/Scoreboard';
import BaseballCard from '@/components/windows/BaseballCard';
import Radio from '@/components/windows/Radio';
import Guestbook from '@/components/windows/Guestbook';
import Jumbotron from '@/components/windows/Jumbotron';
import StadiumMap from '@/components/windows/StadiumMap';

const windows = [
  { id: 'scoreboard' as WindowId, name: 'Scoreboard', icon: '/images/scoreboard_icon.png' },
  { id: 'baseballCard' as WindowId, name: 'Baseball Card', icon: '/images/baseball_card_icon.png' },
  { id: 'radio' as WindowId, name: 'Scully Radio', icon: '/images/baseball_radio_icon.png' },
  { id: 'guestbook' as WindowId, name: 'Guestbook', icon: '/images/guestbook_icon.png' },
  { id: 'jumbotron' as WindowId, name: 'Jumbotron', icon: '/images/jumbotron_icon.png' },
  { id: 'stadiumMap' as WindowId, name: 'Stadium Map', icon: '/images/stadium_map_icon.png' }
];

const Desktop = () => {
  const { openWindow } = useWindowStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(Math.floor(Math.random() * 5000) + 1000);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    openWindow('stadiumMap' as WindowId);
    openWindow('radio' as WindowId);

    return () => clearInterval(timer);
  }, [openWindow]);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  }).format(date);

  const formatTime = (date: Date) => new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(date);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-pixel">
      <div className="text-white py-1 px-3 flex justify-between items-center shadow-md bg-blue-800">
        <div className="font-pixel text-xl">KANA'S STADIUM</div>
        <div className="text-sm">{formatDate(currentTime)} | {formatTime(currentTime)}</div>
      </div>

      <div className="flex-1 relative text-zinc-950 bg-cover bg-center" style={{
        backgroundImage: `url('/images/suzuki2.gif')`
      }}>

        <div className="absolute top-4 right-4 flex flex-col gap-6 z-10">
          {/* Desktop Icons */}
          {windows.map((win) => (
            <div key={win.id} className="desktop-icon" onClick={() => openWindow(win.id)}>
              <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
                <img src={win.icon} alt={win.name} className="w-10 h-10" />
              </div>
              <span className="text-sm text-white">{win.name}</span>
            </div>
          ))}
        </div>

        <Window id="scoreboard"><Scoreboard /></Window>
        <Window id="baseballCard"><BaseballCard /></Window>
        <Window id="radio"><Radio /></Window>
        <Window id="guestbook"><Guestbook /></Window>
        <Window id="jumbotron"><Jumbotron /></Window>
        <Window id="stadiumMap"><StadiumMap /></Window>
      </div>

      <div className="text-white py-1 px-3 flex justify-between items-center shadow-inner text-xs bg-blue-800">
        <div>Last Updated: {formatDate(new Date())}</div>
        <div>Visitor Count: {visitorCount}</div>
      </div>
    </div>
  );
};

export default Desktop;
