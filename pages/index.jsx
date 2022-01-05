import React from "react";
import Head from "next/head";
import Script from "next/script";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Play my thing</title>
        <link rel="icon" href="/lofi.ico" />
      </Head>

      {/* <div id="youtube-player" />
      <Script src="load-yt.js" /> */}
      <iframe
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/videoseries?list=PLsa91shghYK8O5Yhqpb0NsPzucOtgQVTu&autoplay=1"
        title="My playlist 💙"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <main />

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
