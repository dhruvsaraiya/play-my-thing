import React, { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

const PLAYER_DOM_ID = "youtube-player";
const PLAYLIST_ID = "PLsa91shghYK8O5Yhqpb0NsPzucOtgQVTu";
const VOLUME_STEP = 5;

export default function Home() {
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(0);

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
    player.mute();
  };
  const onUnMute = () => {
    player.unMute();
  };
  const onVolumeChange = (e) => {
    setVolume(e.target.value);
    e.preventDefault();
  };
  const increaseVolume = () => {
    setVolume(volume + VOLUME_STEP);
  };
  const decreaseVolume = () => {
    setVolume(volume - VOLUME_STEP);
  };

  const onPlayerReady = () => {
    // not needed
    // player.loadPlaylist({
    //   list: PLAYLIST_ID,
    //   listType: "playlist",
    // });

    // The order here is very important
    player.mute();
    player.playVideoAt(Math.floor(Math.random() * 100));
    setTimeout(() => {
      player.setShuffle(true);
    }, 2000);
  };

  useEffect(() => {
    if (!player) return;
    if (volume > 0 && player.isMuted()) {
      player.unMute();
    }
    player.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener("onReady", onPlayerReady);
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
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&enablejsapi=1`}
        title="My playlist 💙"
        frameBorder="0"
        allow="autoplay;encrypted-media;"
      />
      <main>
        <button type="button" onClick={onPrevious}>
          Previous
        </button>
        <button type="button" onClick={onPause}>
          Pause
        </button>
        <button type="button" onClick={onNext}>
          Next
        </button>
      </main>

      <input
        type="range"
        min="1"
        max="100"
        value={volume}
        id="volume"
        onChange={onVolumeChange}
      />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
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
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
