import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import stremio from "../Resources/stremioIcon.png";

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";
const SLOT_WIDTH = 250;

export default function SlotMachineCarousel({ finalPoster, spinDuration = 1500 }) {
  const [spinning, setSpinning] = useState(true);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!finalPoster) return;
    setSpinning(true);
    const dummySlots = Array(20).fill({});
    setSlots(dummySlots);

    const timer = setTimeout(() => {
      setSpinning(false);
      setSlots([finalPoster]);
    }, spinDuration);

    return () => clearTimeout(timer);
  }, [finalPoster, spinDuration]);

  if (!finalPoster) return null;

 return (
  <div className="flex items-center justify-center mb-4 w-full h-full">
    <div className=" max-h-[90vh] w-full max-w-[90%] flex flex-col items-center bg-black rounded-xl p-4">
      {spinning ? (
        <motion.div
          className="flex space-x-4"
          animate={{ x: [-SLOT_WIDTH * slots.length, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "linear",
          }}
        >
          {[...slots, ...slots].map((_, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[350px] h-[450px] bg-gray-700 rounded-xl border-2 border-gray-500 animate-pulse"
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={`${TMDB_BASE}${finalPoster.poster_path}`}
            alt={finalPoster.displayTitle}
            className="h-[450px] object-contain mb-2 rounded"
          />
          <h2 className="text-green-400 font-bold text-xl text-center">
            {finalPoster.displayTitle}
          </h2>
          <p className="text-green-400 text-sm">{finalPoster.displayReleaseDate}</p>
          <p className="text-green-400 text-sm">
            Rating: {finalPoster.rating} ({finalPoster.vote_count} votes)
          </p>
          {finalPoster.stremioLink ? (
            <a
              href={finalPoster.stremioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-sm mt-2"
            >
              Watch on Stremio!
              <img src={stremio} alt="Stremio" className="inline h-10 ml-1" />
            </a>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No Stremio link available</p>
          )}
        </div>
      )}
    </div>
  </div>
);

}
