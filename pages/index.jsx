/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

const PLAYER_DOM_ID = "youtube-player";
const PLAYLIST_ID = "PLsa91shghYK8O5Yhqpb0NsPzucOtgQVTu";
const INITIAL_VOLUME = 20;
const TITLE_LENGTH = 50;

// Player State
const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;
const CUED = 5;

export default function Home() {
  const [player, setPlayer] = useState(null);
  const [playerState, setPlayerState] = useState(UNSTARTED);
  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  // Mute and Volume are two different things
  const [isMuted, setIsMuted] = useState(true);

  const onNext = () => {
    player.nextVideo();
  };
  const onPrevious = () => {
    player.previousVideo();
  };
  const onPause = () => {
    player.pauseVideo();
  };
  const onPlay = () => {
    player.playVideo();
  };
  const onMute = () => {
    setIsMuted(true);
  };
  const onUnMute = () => {
    setIsMuted(false);
  };
  const onVolumeChange = (e) => {
    setVolume(e.target.value);
    e.preventDefault();
  };

  const onPlayerReady = () => {
    // not needed
    // player.loadPlaylist({
    //   list: PLAYLIST_ID,
    //   listType: "playlist",
    // });

    // The order here is very important
    player.setVolume(INITIAL_VOLUME);
    player.mute();
    player.playVideoAt(Math.floor(Math.random() * 100));
    setTimeout(() => {
      player.setShuffle(true);
    }, 2000);
  };

  const getTitleString = (state) => {
    if (state === PLAYING) {
      return `${(player?.getVideoData()?.title || "").substring(
        0,
        TITLE_LENGTH
      )}...`;
    }
    if (state === PAUSED) return `Play to continue...`;
    if (state === BUFFERING) return `Buffering...`;
    return "";
  };

  const onPlayerStateChange = (event) => {
    const pst = event.data;
    setPlayerState(pst);
    setTitle(getTitleString(pst));
  };

  useEffect(() => {
    if (!player) return;
    if (isMuted) {
      player.mute();
    } else {
      player.unMute();
    }
  }, [isMuted]);

  useEffect(() => {
    if (!player) return;
    if (volume > 0 && player.isMuted()) {
      setIsMuted(false);
    }
    player.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener("onReady", onPlayerReady);
    player.addEventListener("onStateChange", onPlayerStateChange);
  }, [player]);

  useEffect(() => {
    // This is the great learning for me, I was thinking that how do I communicate between React <> JS pages.
    // Everything in dom world belongs to window, so whenever you place a function in JS file ( in my case onYouTubeIframeAPIReady in load-yt.js ) the function belongs to window object.
    // So instead of putting it in load-yt.js file, I can put it over here with attached to window object :)

    // The API will call this function when page has finished downloading
    // the JavaScript for the player API.
    window.onYouTubeIframeAPIReady = () => {
      if (
        window.YT &&
        window.YT.Player &&
        window.YT.Player instanceof Function
      ) {
        // keep the same name as iframe ID, so that new player doesn't pop-up
        setPlayer(new window.YT.Player(PLAYER_DOM_ID));
      }
    };
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Play my thing</title>
        <link rel="icon" href="/lofi.ico" />
      </Head>
      <Script src="load-yt.js" />
      <iframe
        id={PLAYER_DOM_ID}
        width="0"
        height="0"
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&enablejsapi=1`}
        title="My playlist 💙"
        frameBorder="0"
        allow="autoplay;encrypted-media;"
      />
      <div className="parent-box">
        <div className="title-box">{title}</div>
        <div className="media-box">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <img
              src="play-previous.png"
              alt="Prev"
              role="button"
              onClick={onPrevious}
              className="media-button hw-128"
            />
            {playerState !== PAUSED && (
              <img
                src="pause-button.png"
                alt="Pause"
                onClick={onPause}
                role="button"
                className="media-button hw-128"
              />
            )}
            {playerState === PAUSED && (
              <img
                src="play.png"
                alt="Play"
                onClick={onPlay}
                role="button"
                className="media-button hw-128"
              />
            )}
            <img
              src="play-next.png"
              alt="Next"
              onClick={onNext}
              role="button"
              className="media-button hw-128"
            />
          </div>
        </div>
        <div className="sound-box">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <div className="mute-button-parent">
              {isMuted && (
                <img
                  src="no-audio.png"
                  alt="Muted"
                  onClick={onUnMute}
                  role="button"
                  className="media-button"
                />
              )}
              {!isMuted && (
                <img
                  src="high-volume.png"
                  alt="Sound"
                  onClick={onMute}
                  role="button"
                  className="media-button"
                />
              )}
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={volume}
              id="volume"
              onChange={onVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
      <div className="top-right">
        <div />
      </div>
      <div className="bottom-right">
        Icons by <a href="https://icons8.com/license">Icons8</a>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
        }
        .media-button {
          cursor: pointer;
        }
        .hw-128 {
          height: 128px;
          width: 128px;
        }
        .media-box {
          width: 14%;
        }
        .parent-box {
          padding-top: 30vh;
          padding-left: 5vh;
        }
        .title-box {
          color: #ebd2ac;
          font-family: LoFi;
          font-weight: 500;
          font-size: x-large;
        }
        .sound-box {
          height: 64px;
        }
        .mute-button-parent {
          width: 128px;
          display: flex;
          justify-content: center;
        }
        .volume-slider {
          width: 240px;
          -webkit-appearance: none;
          height: 12px;
          background: #ebd2ac;
          border: 2px solid #8c6d9e;
          border-radius: 1rem;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          box-shadow: 1px 1px 1px #000031;
          border: 1px solid #8c6d9e;
          height: 20px;
          width: 20px;
          border-radius: 15px;
          background: #73cbaf;
          cursor: pointer;
          -webkit-appearance: none;
        }
        input[type="range"]::-moz-range-thumb {
          box-shadow: 1px 1px 1px #000031;
          border: 1px solid #8c6d9e;
          height: 20px;
          width: 20px;
          border-radius: 15px;
          background: #73cbaf;
          cursor: pointer;
          -webkit-appearance: none;
        }
        input[type="range"]::-ms-thumb {
          box-shadow: 1px 1px 1px #000031;
          border: 1px solid #8c6d9e;
          height: 20px;
          width: 20px;
          border-radius: 15px;
          background: #73cbaf;
          cursor: pointer;
          -webkit-appearance: none;
        }
        .top-right {
          position: absolute;
          top: 10;
          right: 15;
        }
        .bottom-right {
          position: fixed;
          bottom: 0;
          right: 0;
        }
      `}</style>
      <style jsx global>{`
        @font-face {
          font-family: LoFi;
          src: url(lofi.ttf);
        }
        html,
        body {
          padding: 0;
          margin: 0;
          height: 100%;
          width: 100%;
          background-image: url("lofi.gif");
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-size: cover;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

// Old-fonts
// font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
// Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
// sans-serif;
