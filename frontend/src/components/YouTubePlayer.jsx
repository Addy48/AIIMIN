import React, { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ playlistId, isPlaying, volume, onStateChange, onNext, onPrev }) => {
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);

    useEffect(() => {
        // Load YouTube IFrame API script exactly once
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initPlayer();
            };
        } else if (!playerRef.current) {
            initPlayer();
        }

        return () => {
            if (playerRef.current) {
                // Keep player alive between renders to avoid jarring reloads,
                // but destroy if the component is fully unmounted
                // playerRef.current.destroy(); 
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initPlayer = () => {
        playerRef.current = new window.YT.Player('youtube-player-div', {
            height: '0',
            width: '0',
            playerVars: {
                listType: 'playlist',
                list: playlistId,
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0
            },
            events: {
                onReady: (event) => {
                    setPlayerReady(true);
                    event.target.setVolume(volume);
                    // Load the playlist
                    event.target.cuePlaylist({ list: playlistId });
                },
                onStateChange: (event) => {
                    // Update parent component with YT PlayerState
                    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                    onStateChange(event.data);
                }
            }
        });
    };

    // React to prop changes
    useEffect(() => {
        if (!playerReady || !playerRef.current) return;

        if (isPlaying) {
            playerRef.current.playVideo();
        } else {
            playerRef.current.pauseVideo();
        }
    }, [isPlaying, playerReady]);

    useEffect(() => {
        if (!playerReady || !playerRef.current) return;
        playerRef.current.setVolume(volume);
    }, [volume, playerReady]);

    useEffect(() => {
        // Expose next/prev methods to parent callback refs if needed
        // (Usually handled by calling playerRef.current.nextVideo() from parent, 
        // but we can just use an invisible iframe trick or pass refs)
    }, []);

    // Expose methods directly to window for Hacky MVP parent calling 
    // (A better way is forwardRef, but this is quick and robust for standard embeds)
    useEffect(() => {
        window.ytNextVideo = () => { if (playerRef.current) playerRef.current.nextVideo() };
        window.ytPrevVideo = () => { if (playerRef.current) playerRef.current.previousVideo() };
        return () => {
            delete window.ytNextVideo;
            delete window.ytPrevVideo;
        };
    }, [playerReady]);

    return (
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }}>
            <div id="youtube-player-div"></div>
        </div>
    );
};

export default YouTubePlayer;
