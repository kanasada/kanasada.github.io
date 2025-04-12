import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GuestEntry {
  name: string;
  message: string;
  date: Date;
}

const Guestbook = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestEntry[]>([
    {
      name: "Mookie Betts",
      message: "Great website! Love the retro design!",
      date: new Date('2023-04-15')
    },
    {
      name: "Blake Treinen",
      message: "I just want to say I have a nasty slider.",
      date: new Date('2023-05-22')
    },
    {
      name: "Mike Trout",
      message: "Baseball and classic computers - two of my favorite things!",
      date: new Date('2023-06-10')
    }
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !message) {
      const clickSound = document.getElementById("click-sound") as HTMLAudioElement;
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.error("Error playing sound:", err));
      }
      
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    const newEntry: GuestEntry = {
      name,
      message,
      date: new Date()
    };
    
    setEntries([newEntry, ...entries]);
    setName('');
    setMessage('');
    
    toast({
      title: "Success",
      description: "Your message was added to the guestbook!",
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="h-auto flex flex-col font-ms-sans">
      <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue-800">Stadium Guestbook</h2>
      
      <div className="mb-2 sm:mb-4">
        <form onSubmit={handleSubmit} className="win95-inset p-2 sm:p-3">
          <div className="mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-bold mb-1" htmlFor="name">
              Your Name:
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-400 px-2 py-1 text-xs sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="off"
            />
          </div>
          
          <div className="mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-bold mb-1" htmlFor="message">
              Message:
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-400 px-2 py-1 text-xs sm:text-sm"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message for the guestbook"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="win95-button text-xs sm:text-sm">
              Sign Guestbook
            </button>
          </div>
        </form>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-bold text-xs sm:text-sm mb-1 sm:mb-2">Recent Visitors</div>
        <div className="win95-inset h-[150px] overflow-auto">
          {entries.map((entry, index) => (
            <div 
              key={index}
              className={`p-2 border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
            >
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-bold">{entry.name}</span>
                <span className="text-[10px] sm:text-xs text-gray-500">{formatDate(entry.date)}</span>
              </div>
              <div className="text-[10px] sm:text-xs mt-1">{entry.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
