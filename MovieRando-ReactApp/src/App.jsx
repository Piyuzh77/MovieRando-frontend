import React, { useState, useEffect } from "react";
import CliScreen from "./Components/CliScreen";

function App() {
  // Initialize state based on the current window size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Handler to check screen size and update state
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener for window resizing
    window.addEventListener("resize", checkScreen);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", checkScreen);
  }, []); // The empty dependency array ensures this effect runs only once

  // Conditional rendering based on the isMobile state
  if (isMobile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <h1>🚫 Not supported on small screens. Please use a larger device.</h1>
      </div>
    );
  }

  return (
    <>
      <CliScreen />
    </>
  );
}

export default App;
