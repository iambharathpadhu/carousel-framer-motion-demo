import { useEffect, useState } from "react";
import "./App.css";
import { Carousel } from "./Carousel";

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = async () => {
    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      setIsFullscreen(!!document.fullscreenElement);
    });

    return () => {
      document.removeEventListener("fullscreenchange", () => {
        setIsFullscreen(!!document.fullscreenElement);
      });
    };
  }, []);
  return (
    <div className={`fullscreen-container ${isFullscreen ? "fullscreen" : ""}`}>
      <button
        onClick={enterFullscreen}
        style={{
          display: isFullscreen ? "none" : "block",
          position: "absolute",
          top: "0",
          left: "1",
          zIndex: 2,
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        Go Fullscreen
      </button>
      <Carousel isFullscreen={isFullscreen} />
    </div>
  );
}

export default App;
