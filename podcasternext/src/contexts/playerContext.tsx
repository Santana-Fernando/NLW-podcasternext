import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    durationAsString: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (episode: Episode[], index: number) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPreviuos: boolean;
    toggleLoop: () => void;
    isLooping: boolean;
    toggleShuffle: () => void;
    isShuffling: boolean;
    clearPlayerState: () => void;

}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProvaiderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProvaiderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setPlayingState(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  const hasPreviuos = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext(){

    if(isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }

  }

  function playPrevious() {
    if(hasPreviuos) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
      setEpisodeList([])
      setCurrentEpisodeIndex(0)
  }

  return (
    
    <PlayerContext.Provider value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play, 
        isPlaying,
        playNext,
        playPrevious,
        playList, 
        togglePlay, 
        setPlayingState,
        hasPreviuos,
        hasNext,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    }}
    >
        {children}
    </PlayerContext.Provider>
  )
      
}

export const userPlayer = () => {
    return useContext(PlayerContext)
}