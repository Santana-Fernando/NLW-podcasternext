import { useRef, useEffect, useState } from 'react';
import Image from 'next/image'
import { userPlayer } from '../../contexts/playerContext';
import styles from './styles.module.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTImeString } from '../../utils/convertDurationToTImeString';
export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)


    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPreviuos,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = userPlayer()
    
    useEffect(() => {
        if(!audioRef.current){
            return
        }

        if(isPlaying){
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setUpProgressListener() {
        audioRef.current.currentTime = 0


        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        console.log("Entrou aqui no handle seek")
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Reproduzir"/>
                <strong>Tocando agora {episode? episode.title: ''}</strong>
        
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (

                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : null}>
                <div className={styles.progress}>
                    <span>{convertDurationToTImeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.durationAsString}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTImeString(episode?.durationAsString ?? 0)}</span>
                </div>


                { episode && (
                    <audio 
                        ref={audioRef} 
                        src={episode.url} 
                        autoPlay 
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)} 
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setUpProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={ isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPreviuos}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode} 
                        onClick={togglePlay}
                    >
                        {isPlaying 
                        ?<img src="/pause.svg" alt="Tocar"/>
                        :<img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                    type="button" 
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={ isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repitir"/>
                    </button>
                </div>
            </footer>
        </div> 
    );
}