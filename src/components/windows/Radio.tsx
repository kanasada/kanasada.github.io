import { useState, useEffect, useRef } from 'react';
import { SkipBack, Pause, Play, SkipForward, Share } from 'lucide-react';

// Add the type declaration for the onYouTubeIframeAPIReady property
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

interface YTPlayer {
  destroy: () => void;
  getVideoData: () => any;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaylist: () => string[];
  playVideo: () => void;
  pauseVideo: () => void;
  playVideoAt: (index: number) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  loadPlaylist: (playlist: string, index?: number, startSeconds?: number) => void;
  getPlaylistIndex: () => number;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

// Create a unique ID for each player instance
const generatePlayerId = () => `youtube-player-${Math.random().toString(36).substr(2, 9)}`;

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [currentTrack, setCurrentTrack] = useState('Loading...');
  const [artist, setArtist] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const playerId = useRef(generatePlayerId());

  useEffect(() => {
    mountedRef.current = true;
    let scriptLoaded = false;

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          scriptLoaded = true;
          resolve();
        };
      });
    };

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();
        
        if (!mountedRef.current) return;

        // Clean up any existing player with the same ID
        const existingPlayer = document.getElementById(playerId.current);
        if (existingPlayer) {
          existingPlayer.remove();
        }

        // Create a new player container
        const container = document.createElement('div');
        container.id = playerId.current;
        document.getElementById('youtube-container')?.appendChild(container);

        playerRef.current = new window.YT.Player(playerId.current, {
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
            onError: (event) => {
              console.error('YouTube player error:', event);
              setCurrentTrack('Error playing track');
              setIsLoading(false);
            }
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setCurrentTrack('Error loading player');
        setIsLoading(false);
      }
    };

    initializePlayer();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
        playerRef.current = null;
      }
      // Clean up the player container
      const container = document.getElementById(playerId.current);
      if (container) {
        container.remove();
      }
    };
  }, []);

  const onPlayerReady = (event: YTPlayerEvent) => {
    if (!mountedRef.current) return;
    
    const player = event.target;
    setIsLoading(false);
    
    try {
      // Reload the playlist to ensure it's properly loaded
      player.loadPlaylist('PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4', 
        Math.floor(Math.random() * 20), // Random start index
        0 // Start from beginning of track
      );
      
      updateTrackInfo(player);
    } catch (error) {
      console.error('Error in onPlayerReady:', error);
      setCurrentTrack('Error starting playback');
    }
  };

  const updateTrackInfo = (player: YTPlayer) => {
    if (!mountedRef.current) return;

    try {
      const videoData = player.getVideoData();
      if (videoData && videoData.title) {
        const parts = videoData.title.split(' - ');
        if (parts.length > 1) {
          setCurrentTrack(parts[1].trim());
          setArtist(parts[0].trim());
        } else {
          setCurrentTrack(videoData.title.trim());
          setArtist('Vin Scully the GOAT');
        }
      }
      updateTimeInfo(player);
    } catch (error) {
      console.error('Error updating track info:', error);
      setCurrentTrack('Error loading track info');
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlayerStateChange = (event: YTStateChangeEvent) => {
    if (!mountedRef.current) return;

    const player = event.target;
    const newIsPlaying = player.getPlayerState() === window.YT.PlayerState.PLAYING;
    setIsPlaying(newIsPlaying);
    
    if (event.data === window.YT.PlayerState.PLAYING) {
      updateTrackInfo(player);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = window.setInterval(() => {
        if (mountedRef.current && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
          updateTimeInfo(player);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);
    }
  };

  const updateTimeInfo = (player: YTPlayer) => {
    if (!mountedRef.current) return;

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
    if (!playerRef.current || isLoading) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (!playerRef.current || isLoading) return;

    try {
      // Get current index before skipping
      const currentIndex = playerRef.current.getPlaylistIndex();
      
      if (direction === 'next') {
        playerRef.current.nextVideo();
      } else {
        playerRef.current.previousVideo();
      }

      // Check if the track actually changed after a delay
      setTimeout(() => {
        if (!playerRef.current || !mountedRef.current) return;
        
        const newIndex = playerRef.current.getPlaylistIndex();
        if (newIndex === currentIndex) {
          // If index didn't change, try to force it
          if (direction === 'next') {
            playerRef.current.playVideoAt((currentIndex + 1) % 20); // Assuming playlist length
          } else {
            playerRef.current.playVideoAt(currentIndex === 0 ? 19 : currentIndex - 1);
          }
        }
        updateTrackInfo(playerRef.current);
      }, 500);
    } catch (error) {
      console.error(`Error ${direction === 'next' ? 'next' : 'previous'} track:`, error);
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
                  height: `${Math.max(10, Math.floor(Math.random() * (isPlaying ? 100 : 20)))}%`,
                  transition: 'height 150ms ease-in-out'
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
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => skipTrack('prev')}
              disabled={isLoading}
            >
              <SkipBack size={14} />
            </button>
            <button 
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={togglePlay}
              disabled={isLoading}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button 
              className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => skipTrack('next')}
              disabled={isLoading}
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
      
      {/* Hidden YouTube iframe container */}
      <div id="youtube-container" style={{ display: 'none' }} />
    </div>
  );
};

export default Radio;
