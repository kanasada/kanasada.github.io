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
  getPlaylistIndex: () => number;
  playVideoAt: (index: number) => void;
  getVideoData: () => { title: string; author: string; video_id: string };
  destroy: () => void;
  loadPlaylist: (options: { 
    listType: string; 
    list: string; 
    index?: number; 
    startSeconds?: number;
  }) => void;
  cuePlaylist: (options: {
    listType: string;
    list: string;
    index?: number;
    startSeconds?: number;
  }) => void;
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
        CUED: number;
        UNSTARTED: number;
      };
    };
  }
}

const PLAYLIST_ID = 'PLAlDA2cK3weRJFmSmzcpda6R5pRcYp6Z4';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [currentTrack, setCurrentTrack] = useState('Loading...');
  const [artist, setArtist] = useState('');
  const [playerReady, setPlayerReady] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const playlistIndexRef = useRef<number>(0);

  useEffect(() => {
    // Check if YouTube IFrame API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    console.log('Initializing YouTube player...');
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      playerVars: {
        listType: 'playlist',
        list: PLAYLIST_ID,
        controls: 0,
        showinfo: 0,
        autoplay: 1,
        enablejsapi: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        fs: 0,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: (e) => console.error('YouTube player error:', e),
      },
    });
  };

  const onPlayerReady = (event: YTPlayerEvent) => {
    console.log('Player ready!');
    const player = event.target;
    setPlayerReady(true);
    
    try {
      // Make sure the playlist is loaded
      const playlistSize = player.getPlaylist()?.length || 0;
      console.log(`Playlist loaded with ${playlistSize} videos`);
      
      if (playlistSize > 0) {
        // Play a random video in the playlist
        const randomIndex = Math.floor(Math.random() * playlistSize);
        console.log(`Starting at random index: ${randomIndex}`);
        playlistIndexRef.current = randomIndex;
        player.playVideoAt(randomIndex);
      } else {
        console.log('No playlist found, trying to load playlist...');
        player.loadPlaylist({
          listType: 'playlist',
          list: PLAYLIST_ID,
        });
        player.playVideo();
      }
      
      updateTrackInfo(player);
    } catch (error) {
      console.error('Error in onPlayerReady:', error);
    }
  };

  const updateTrackInfo = (player: YTPlayer) => {
    try {
      // Update the current playlist index
      const currentIndex = player.getPlaylistIndex();
      if (currentIndex !== -1) {
        playlistIndexRef.current = currentIndex;
        console.log(`Current playlist index: ${currentIndex}`);
      }
      
      const videoData = player.getVideoData();
      if (videoData && videoData.title) {
        console.log(`Now playing: ${videoData.title}`);
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
    console.log(`Player state changed to: ${event.data}`);
    const player = event.target;
    
    setIsPlaying(player.getPlayerState() === window.YT.PlayerState.PLAYING);
    
    if (event.data === window.YT.PlayerState.PLAYING) {
      updateTrackInfo(player);
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = window.setInterval(() => {
        if (player && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
          updateTimeInfo(player);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);
      
      // If we were in a skipping state, we're now done
      if (isSkipping) {
        setIsSkipping(false);
      }
    } else if (event.data === window.YT.PlayerState.ENDED) {
      // When a track ends, make sure to update the info for the next track
      setTimeout(() => {
        if (player) updateTrackInfo(player);
      }, 1000);
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
        console.log('Pausing video');
        playerRef.current.pauseVideo();
      } else {
        console.log('Playing video');
        playerRef.current.playVideo();
      }
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (!playerRef.current || !playerReady || isSkipping) return;
    
    try {
      setIsSkipping(true);
      console.log(`Skipping ${direction}...`);
      
      const playlistSize = playerRef.current.getPlaylist()?.length || 0;
      if (playlistSize === 0) {
        console.error('No playlist available');
        setIsSkipping(false);
        return;
      }
      
      let newIndex;
      const currentIndex = playerRef.current.getPlaylistIndex();
      
      if (currentIndex === -1) {
        // If we can't get the index, use our tracked index
        newIndex = direction === 'next' ? 
          (playlistIndexRef.current + 1) % playlistSize : 
          (playlistIndexRef.current - 1 + playlistSize) % playlistSize;
      } else {
        // Calculate the new index based on direction
        newIndex = direction === 'next' ? 
          (currentIndex + 1) % playlistSize : 
          (currentIndex - 1 + playlistSize) % playlistSize;
      }
      
      console.log(`Skipping from index ${currentIndex} to ${newIndex}`);
      playlistIndexRef.current = newIndex;
      
      // Use playVideoAt which is more reliable than nextVideo/previousVideo
      playerRef.current.playVideoAt(newIndex);
      
      // Update track info after a delay
      setTimeout(() => {
        if (playerRef.current) {
          updateTrackInfo(playerRef.current);
          setIsSkipping(false);
        }
      }, 1000);
    } catch (error) {
      console.error(`Error skipping ${direction}:`, error);
      setIsSkipping(false);
    }
  };

  return (
    <div className="h-full flex flex-col font-ms-sans">
      <div className="p-2 sm:p-4 h-full overflow-auto">
        <div className="win95-inset p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold mb-1">{currentTrack}</div>
              <div className="text-sm sm:text-base text-gray-600">{artist}</div>
            </div>
            
            <div className="flex justify-center gap-2 sm:gap-4">
              <button 
                onClick={() => skipTrack('prev')}
                className="win95-button p-1 sm:p-2"
                disabled={!playerReady || isSkipping}
              >
                <SkipBack size={16} />
              </button>
              
              <button 
                onClick={togglePlay}
                className="win95-button p-2 sm:p-3"
                disabled={!playerReady}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                onClick={() => skipTrack('next')}
                className="win95-button p-1 sm:p-2"
                disabled={!playerReady || isSkipping}
              >
                <SkipForward size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>{currentTime}</span>
              <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-800"
                  style={{ width: `${(parseInt(currentTime) / parseInt(duration)) * 100}%` }}
                ></div>
              </div>
              <span>{duration}</span>
            </div>
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
