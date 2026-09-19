import React, { useEffect } from 'react';
import { useAudioStore } from '../store/audioStore';
import './BackgroundMusic.css';

// Create a global singleton audio element outside the component
// This ensures it persists across route changes and unmounts
const globalAudio = new Audio();
globalAudio.loop = true;

const BackgroundMusic = ({ src, volume = 0.3 }) => {
    const { isMuted, toggleMute } = useAudioStore();

    useEffect(() => {
        globalAudio.volume = volume;
        globalAudio.muted = isMuted;

        const currentSrcKey = globalAudio.dataset.currentSrc;

        // If the requested src is different from what's currently playing
        if (currentSrcKey !== src) {
            globalAudio.src = src;
            globalAudio.dataset.currentSrc = src;

            const playAudio = () => {
                globalAudio.play().catch(error => {
                    console.warn("Autoplay prevented. Waiting for user interaction.", error);
                    const playOnInteraction = () => {
                        globalAudio.play().catch(err => console.error(err));
                        document.removeEventListener('click', playOnInteraction);
                    };
                    document.addEventListener('click', playOnInteraction);
                });
            };

            playAudio();
        } else if (globalAudio.paused) {
            // If it's the same track but paused, ensure it plays
            globalAudio.play().catch(error => {
                console.warn("Autoplay prevented on same track. Waiting for user interaction.", error);
                const playOnInteraction = () => {
                    globalAudio.play().catch(err => console.error(err));
                    document.removeEventListener('click', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
            });
        }

        // We do not stop the music on unmount to allow seamless transition between pages
    }, [src, volume]);

    useEffect(() => {
        globalAudio.muted = isMuted;
    }, [isMuted]);

    return (
        <button
            className="background-music-toggle"
            onClick={toggleMute}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            title={isMuted ? "Bật âm thanh (Nhạc nền & Buddy nhại tiếng)" : "Tắt âm thanh (Nhạc nền & Buddy nhại tiếng)"}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
};

export const stopBackgroundMusic = () => {
    globalAudio.pause();
    globalAudio.currentTime = 0;
};

export default BackgroundMusic;

