import { useEffect, useState } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const loadingTexts = [
    "INSTALLING BASEBALL.EXE",
    "LOADING PLAYER STATS...",
    "COMPILING SCOREBOARDS...",
    "INFLATING BEACH BALLS...",
    "UNPACKING HOT DOG VENDORS...",
    "WARMING UP PITCHERS...",
    "CHALKING BASELINE.SYS",
    "LOADING KANA OS v9.5..."
  ];

  useEffect(() => {
    setIsInitialized(true);
    let textIndex = 0;
    let charIndex = 0;
    
    const textInterval = setInterval(() => {
      if (textIndex >= loadingTexts.length) {
        clearInterval(textInterval);
        return;
      }
      
      const currentLoadingText = loadingTexts[textIndex];
      
      if (charIndex < currentLoadingText.length) {
        setCurrentText(prev => prev + currentLoadingText[charIndex]);
        charIndex++;
      } else {
        setTimeout(() => {
          setCurrentText("");
          textIndex++;
          charIndex = 0;
        }, 1000);
      }
    }, 100);
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => {
      clearInterval(textInterval);
      clearInterval(cursorInterval);
    };
  }, []);
  
  useEffect(() => {
    if (!isInitialized) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(interval);
        return 100;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isInitialized]);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col items-center justify-center p-8 font-pixel text-green-500 z-50">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <pre className="text-center text-lg whitespace-pre mb-2">
{`
 ▄ •▄   ▄▄▄·   ▐   ▄  ▄▄▄·  .▄▄ ·    .▄▄ · ▄▄▄▄▄ ▄▄▄· ·▄▄▄▄  ▪  ▄• ▄▌• ▌ ▄ ·.
 █▌▄▌▪ ▐█ ▀█  •█▌ ▐█ ▐█ ▀█  ▐█ ▀.    ▐█ ▀. •██  ▐█ ▀█ ██▪ ██ ██ █▪██▌·██ ▐███▪
 ▐▀▀▄· ▄█▀▀█  ▐█▐ ▐▌ ▀█▀▀█  ▄▀▀▀█▄   ▄▀▀▀█▄ ▐█.▪▄█▀▀█ ▐█· ▐█▌▐█·█▌▐█▌▐█ ▌▐▌▐█·
 ▐█.█▌ ▐█ ▪▐▌ ██ ▐█▌ ▐█ ▪▐▌ ▐█▄▪▐█   ▐█▄▪▐█ ▐█▌·▐█ ▪▐▌██. ██ ▐█▌▐█▄█▌██ ██▌▐█▌
 ·▀  ▀  ▀  ▀ ▀▀   █▪  ▀  ▀   ▀▀▀▀     ▀▀▀▀  ▀▀▀  ▀  ▀ ▀▀▀▀▀• ▀▀▀ ▀▀▀ ▀▀  █▪▀▀▀
`}
        </pre>

        <div className="text-left mb-2 min-h-[24px]">
          {currentText}
          {showCursor && <span className="animate-blink">_</span>}
        </div>
        
        <div className="loading-bar">
          <div 
            className="loading-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-center mt-10 font-pixel">
          PRESS SPACE TO ENTER STADIUM{showCursor && <span className="animate-blink">_</span>}
        </div>
      </div>
    </div>
  );
};

export default Loading;
