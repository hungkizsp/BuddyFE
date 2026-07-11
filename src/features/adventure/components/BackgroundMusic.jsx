import React, { useEffect, useRef } from 'react';

const BackgroundMusic = ({ src, volume = 0.3 }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;

            const playAudio = () => {
                audioRef.current?.play().catch(error => {
                    console.warn("Autoplay prevented. Waiting for user interaction.", error);
                    const playOnInteraction = () => {
                        if (audioRef.current) {
                            audioRef.current.play().catch(err => console.error(err));
                        }
                        document.removeEventListener('click', playOnInteraction);
                    };
                    document.addEventListener('click', playOnInteraction);
                });
            };
            
            playAudio();
        }
    }, [volume]);

    return (
        <audio ref={audioRef} loop>
            <source src={src} type="audio/mpeg" />
            Trình duyệt của bạn không hỗ trợ thẻ audio.
        </audio>
    );
};

export default BackgroundMusic;
