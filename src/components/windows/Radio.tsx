import { useState, useEffect, useRef } from 'react';
import { SkipBack, Pause, Play, SkipForward, Share } from 'lucide-react';

// Define the YouTube Player interface
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaylist: () => string[];
  playVideoAt: (index: number) => void;
  getVideoData: () => { title: string; author: string; video_id: string };
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (elementId: string, options: any) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
  }
}

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [currentTrack, setCurrentTrack] = useState('Loading...');
  const [artist, setArtist] = useState('');
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: 'PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4',
          controls: 0,
          showinfo: 0,
          autoplay: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const onPlayerReady = (event: YTPlayerEvent) => {
    // Player is ready
    const player = event.target;
    setPlayerReady(true);
    
    // Play a random video in the playlist
    const playlistSize = player.getPlaylist()?.length || 0;
    if (playlistSize > 0) {
      const randomIndex = Math.floor(Math.random() * playlistSize);
      player.playVideoAt(randomIndex);
    } else {
      player.playVideo();
    }
    
    updateTrackInfo(player);
  };

  const updateTrackInfo = (player: YTPlayer) => {
    try {
      const videoData = player.getVideoData();
      if (videoData && videoData.title) {
        // Try to split title into song and artist
        const parts = videoData.title.split(' - ');
        if (parts.length > 1) {
          setCurrentTrack(parts[1]);
          setArtist(parts[0]);
        } else {
          setCurrentTrack(videoData.title);
          setArtist('Vin Scully the GOAT');
        }
      }
      updateTimeInfo(player);
    } catch (error) {
      console.error('Error updating track info:', error);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlayerStateChange = (event: YTStateChangeEvent) => {
    const player = event.target;
    
    setIsPlaying(player.getPlayerState() === window.YT.PlayerState.PLAYING);
    
    if (event.data === window.YT.PlayerState.PLAYING) {
      updateTrackInfo(player);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = window.setInterval(() => {
        if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
          updateTimeInfo(player);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      // When a track ends, make sure to update the info for the next track
      setTimeout(() => updateTrackInfo(player), 1000);
    }
  };

  const updateTimeInfo = (player: YTPlayer) => {
    try {
      const currentTimeInSeconds = player.getCurrentTime();
      const durationInSeconds = player.getDuration();
      
      setCurrentTime(formatTime(currentTimeInSeconds));
      setDuration(formatTime(durationInSeconds));
    } catch (error) {
      console.error('Error updating time info:', error);
    }
  };

  const togglePlay = () => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (playerRef.current && playerReady) {
      try {
        if (direction === 'next') {
          playerRef.current.nextVideo();
        } else {
          playerRef.current.previousVideo();
        }
        
        // Update track info after a short delay to allow the player to change tracks
        setTimeout(() => {
          if (playerRef.current) {
            updateTrackInfo(playerRef.current);
          }
        }, 500);
      } catch (error) {
        console.error(`Error skipping ${direction}:`, error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col font-pixel">
      <div className="bg-[#F1F1F1] border border-gray-800 w-full flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center border-b border-gray-800 p-1 bg-white">
          <div className="h-3 w-3 border border-gray-800 mr-1 flex-shrink-0">
            <div className="w-1 h-1 bg-black m-0.5"></div>
          </div>
          <div className="flex-1 h-0.5 bg-gray-800 mx-1"></div>
          <div className="font-pixel text-xs text-right">Scully Radio</div>
        </div>
        
        {/* Visualizer */}
        <div className="h-8 bg-black p-1">
          <div className="h-full flex items-center justify-evenly">
            {Array.from({ length: 32 }).map((_, i) => (
              <div 
                key={i} 
                className="w-0.5 bg-[#8E9196]" 
                style={{ 
                  height: `${Math.max(10, Math.floor(Math.random() * (isPlaying ? 100 : 20)))}%`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Current track info */}
        <div className="px-2 py-2">
          <div className="text-xs text-gray-700 mb-1">{currentTime} / {duration}</div>
          <div className="text-sm font-pixel mb-0.5">{currentTrack}</div>
          <div className="text-xs">{artist}</div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-between px-2 mt-2 mb-2">
          <div className="flex space-x-1">
            <button 
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
              onClick={() => skipTrack('prev')}
              disabled={!playerReady}
            >
              <SkipBack size={14} />
            </button>
            <button 
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
              onClick={togglePlay}
              disabled={!playerReady}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button 
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
              onClick={() => skipTrack('next')}
              disabled={!playerReady}
            >
              <SkipForward size={14} />
            </button>
          </div>
          
          <div className="flex space-x-1">
            <a
              href="https://www.youtube.com/playlist?list=PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
            >
              <Share size={14} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hidden YouTube iframe */}
      <div style={{ display: 'none' }}>
        <div id="youtube-player"></div>
      </div>
    </div>
  );
};

export default Radio;
// import { useState, useEffect, useRef } from 'react';
// import { SkipBack, Pause, Play, SkipForward, Share } from 'lucide-react';

// // Add the type declaration for the onYouTubeIframeAPIReady property
// declare global {
//   interface Window {
//     onYouTubeIframeAPIReady: () => void;
//     YT: {
//       Player: new (elementId: string, options: any) => YTPlayer;
//       PlayerState: {
//         PLAYING: number;
//         PAUSED: number;
//         ENDED: number;
//         BUFFERING: number;
//       };
//     };
//   }
// }

// const Radio = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState('00:00');
//   const [duration, setDuration] = useState('00:00');
//   const [currentTrack, setCurrentTrack] = useState('Loading...');
//   const [artist, setArtist] = useState('');
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const playerRef = useRef<YTPlayer | null>(null);
//   const intervalRef = useRef<number | null>(null);

//   useEffect(() => {
//     const tag = document.createElement('script');
//     tag.src = 'https://www.youtube.com/iframe_api';
//     const firstScriptTag = document.getElementsByTagName('script')[0];
//     firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

//     window.onYouTubeIframeAPIReady = () => {
//       playerRef.current = new window.YT.Player('youtube-player', {
//         height: '0',
//         width: '0',
//         playerVars: {
//           listType: 'playlist',
//           list: 'PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4',
//           controls: 0,
//           showinfo: 0,
//           autoplay: 1
//         },
//         events: {
//           onReady: onPlayerReady,
//           onStateChange: onPlayerStateChange,
//         },
//       });
//     };

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }
//     };
//   }, []);

//   const onPlayerReady = (event: YTPlayerEvent) => {
//     // Player is ready
//     const player = event.target;
    
//     // Play a random video in the playlist
//     const playlistSize = player.getPlaylist()?.length || 0;
//     if (playlistSize > 0) {
//       const randomIndex = Math.floor(Math.random() * playlistSize);
//       player.playVideoAt(randomIndex);
//     } else {
//       player.playVideo();
//     }
    
//     updateTrackInfo(player);
//   };

//   const updateTrackInfo = (player: YTPlayer) => {
//     try {
//       const videoData = player.getVideoData();
//       if (videoData && videoData.title) {
//         // Try to split title into song and artist
//         const parts = videoData.title.split(' - ');
//         if (parts.length > 1) {
//           setCurrentTrack(parts[1]);
//           setArtist(parts[0]);
//         } else {
//           setCurrentTrack(videoData.title);
//           setArtist('Vin Scully the GOAT');
//         }
//       }
//       updateTimeInfo(player);
//     } catch (error) {
//       console.error('Error updating track info:', error);
//     }
//   };

//   const formatTime = (timeInSeconds: number): string => {
//     const minutes = Math.floor(timeInSeconds / 60);
//     const seconds = Math.floor(timeInSeconds % 60);
//     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const onPlayerStateChange = (event: YTStateChangeEvent) => {
//     const player = event.target;
    
//     setIsPlaying(player.getPlayerState() === window.YT.PlayerState.PLAYING);
    
//     if (event.data === window.YT.PlayerState.PLAYING) {
//       updateTrackInfo(player);
      
//       if (intervalRef.current) clearInterval(intervalRef.current);
      
//       intervalRef.current = window.setInterval(() => {
//         if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
//           updateTimeInfo(player);
//         } else {
//           if (intervalRef.current) clearInterval(intervalRef.current);
//         }
//       }, 1000);
//     }
//   };

//   const updateTimeInfo = (player: YTPlayer) => {
//     try {
//       const currentTimeInSeconds = player.getCurrentTime();
//       const durationInSeconds = player.getDuration();
      
//       setCurrentTime(formatTime(currentTimeInSeconds));
//       setDuration(formatTime(durationInSeconds));
//     } catch (error) {
//       console.error('Error updating time info:', error);
//     }
//   };

//   const togglePlay = () => {
//     if (playerRef.current) {
//       if (isPlaying) {
//         playerRef.current.pauseVideo();
//       } else {
//         playerRef.current.playVideo();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const skipTrack = (direction: 'next' | 'prev') => {
//     if (playerRef.current) {
//       if (direction === 'next') {
//         playerRef.current.nextVideo();
//       } else {
//         playerRef.current.previousVideo();
//       }
//     }
//   };

//   return (
//     <div className="h-full flex flex-col font-pixel">
//       <div className="bg-[#F1F1F1] border border-gray-800 w-full flex flex-col overflow-hidden">
//         {/* Header bar */}
//         <div className="flex items-center border-b border-gray-800 p-1 bg-white">
//           <div className="h-3 w-3 border border-gray-800 mr-1 flex-shrink-0">
//             <div className="w-1 h-1 bg-black m-0.5"></div>
//           </div>
//           <div className="flex-1 h-0.5 bg-gray-800 mx-1"></div>
//           <div className="font-pixel text-xs text-right">Scully Radio</div>
//         </div>
        
//         {/* Visualizer */}
//         <div className="h-8 bg-black p-1">
//           <div className="h-full flex items-center justify-evenly">
//             {Array.from({ length: 32 }).map((_, i) => (
//               <div 
//                 key={i} 
//                 className="w-0.5 bg-[#8E9196]" 
//                 style={{ 
//                   height: `${Math.max(10, Math.floor(Math.random() * (isPlaying ? 100 : 20)))}%`
//                 }}
//               ></div>
//             ))}
//           </div>
//         </div>
        
//         {/* Current track info */}
//         <div className="px-2 py-2">
//           <div className="text-xs text-gray-700 mb-1">{currentTime} / {duration}</div>
//           <div className="text-sm font-pixel mb-0.5">{currentTrack}</div>
//           <div className="text-xs">{artist}</div>
//         </div>
        
//         {/* Controls */}
//         <div className="flex justify-between px-2 mt-2 mb-2">
//           <div className="flex space-x-1">
//             <button 
//               className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
//               onClick={() => skipTrack('prev')}
//             >
//               <SkipBack size={14} />
//             </button>
//             <button 
//               className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
//               onClick={togglePlay}
//             >
//               {isPlaying ? <Pause size={14} /> : <Play size={14} />}
//             </button>
//             <button 
//               className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
//               onClick={() => skipTrack('next')}
//             >
//               <SkipForward size={14} />
//             </button>
//           </div>
          
//           <div className="flex space-x-1">
//             <a
//               href="https://www.youtube.com/playlist?list=PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center"
//             >
//               <Share size={14} />
//             </a>
//           </div>
//         </div>
//       </div>
      
//       {/* Hidden YouTube iframe */}
//       <div style={{ display: 'none' }}>
//         <div id="youtube-player"></div>
//       </div>
//     </div>
//   );
// };

// export default Radio;
