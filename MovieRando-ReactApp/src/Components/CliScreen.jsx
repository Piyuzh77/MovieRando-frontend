import React, { useState, useRef, useEffect } from "react";
import SlotMachineCarousel from "./SlotMachineCarousel";
import FloatingInput from "./PromprInput";
import { commandRegistry } from "./commandRegistry";
import messages from "../Resources/Messages.json";

export default function CliScreen() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [posters, setPosters] = useState([]);
  const [welcomeTyped, setWelcomeTyped] = useState(false);
  const prompt = "user0@movieRando";
  const historyRef = useRef(null);

  const typeText = (text, callback, speed = 25) => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        callback(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  };

  useEffect(() => {
    typeText(messages.welcome, (txt) =>
      setHistory([{ command: "", output: txt }])
    ).then(() => setWelcomeTyped(true));
  }, []);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const changePage = async (delta, idx) => {
    const histItem = history[idx];
    if (!histItem?.output?.type) return;

    const newPage = histItem.output.page + delta;
    if (newPage < 1) return;

    const commandEntry = Object.entries(commandRegistry).find(([key]) =>
      histItem.command.startsWith(key)
    );
    if (!commandEntry) return;

    const [baseCommand, commandFunc] = commandEntry;
    const args = histItem.command.slice(baseCommand.length).trim();
    const newOutput = await commandFunc(args, newPage);

    setHistory((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, output: newOutput } : h))
    );
  };

  const handleKeys = async (e) => {
    if (!["Enter", "ArrowUp", "ArrowDown"].includes(e.key)) return;

    if (e.key === "Enter") {
      const command = input.trim();
      if (!command) return;

      let output;

      if (command === "help") {
        setHistory((prev) => [...prev, { command, output: messages.help }]);
        setInput("");
        return;
      }

      if (command === "get-started") {
        setHistory((prev) => [
          ...prev,
          { command, output: messages.getStarted },
        ]);
        setInput("");
        return;
      }

      if (command === "clear") {
        setHistory([]);
        setInput("");
        setHistoryIndex(null);
        return;
      }

      const entry = Object.entries(commandRegistry).find(([key]) =>
        command.startsWith(key)
      );

      if (entry) {
        const [baseCommand, func] = entry;
        const args = command.slice(baseCommand.length).trim();
        const result = await func(args);

        if (!result.error) {
          let infoObj = null;
          if (baseCommand === "mr -random") {
            infoObj = {
              id: result.id,
              type: result.media_type || "movie",
              poster_path: result.poster_path || "",
              displayTitle: result.displayTitle || result.name,
              displayReleaseDate:
                result.displayReleaseDate || result.first_air_date || "N/A",
              stremioLink: result.stremioLink,
              genres: result.genres,
              overview: result.overview,
              rating: result.vote_average,
              vote_count: result.vote_count,
            };
          }

          if (infoObj) setPosters((prev) => [...prev, infoObj]);
        }

        output = result.error || result;
      } else {
        output = `Command not found: ${command}`;
      }

      setHistory((prev) => [...prev, { command, output }]);
      setInput("");
      setHistoryIndex(null);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const newIndex =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex].command);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length || historyIndex === null) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex].command);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-green-400 font-mono flex">
      <div className="w-[60%] h-[70%] flex justify-center items-start p-4 overflow-hidden">
        <SlotMachineCarousel
          finalPoster={posters[posters.length - 1] || null}
          spinDuration={3000}
        />
      </div>

      <div className="w-[40%] relative border-l border-green-400 flex flex-col">
        <div
          ref={historyRef}
          className="p-4 overflow-y-scroll"
          style={{ height: "70vh" }}
        >
          {history.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex">
                <span className="mr-2">{prompt}$</span>
                <span>{item.command}</span>
              </div>

              {typeof item.output === "string" && (
                <div className="ml-4 whitespace-pre-wrap">{item.output}</div>
              )}

              {item.output?.type === "list" && (
                <div className="ml-4 flex flex-wrap gap-2">
                  {item.output.items.map((m) => (
                    <div
                      key={m.id + m.year}
                      className="flex-shrink min-w-0 w-[200px] break-words cursor-pointer text-blue-400 hover:underline"
                      onClick={() => {
                        const infoObj = {
                          id: m.id,
                          type: m.type,
                          poster_path: m.poster,
                          displayTitle: m.title,
                          displayReleaseDate: m.year,
                          stremioLink: m.stremioLink,
                          genres: m.genres,
                          overview: m.overview,
                          rating: m.rating,
                          vote_count: m.vote_count,
                        };
                        setPosters((prev) => [...prev, infoObj]);
                      }}
                    >
                      {m.title} ({m.year})
                    </div>
                  ))}

                  <div className="w-full flex-2 flex gap-2 mt-2">
                    {item.output.page > 1 && (
                      <button
                        className="text-green-400 hover:text-green-200 px-2 py-0.5 border border-green-400 rounded"
                        onClick={() => changePage(-1, idx)}
                      >
                        [previous]
                      </button>
                    )}
                    {item.output.total_pages &&
                      item.output.page < item.output.total_pages && (
                        <button
                          className="text-green-400 hover:text-green-200 px-2 py-0.5 border border-green-400 rounded"
                          onClick={() => changePage(1, idx)}
                        >
                          [next]
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-green-400 p-2 sm:p-4 flex items-center max-w-screen">
          <FloatingInput
            prompt={prompt}
            input={input}
            setInput={setInput}
            handleKeys={handleKeys}
          />
        </div>

        <h1></h1>
      </div>
    </div>
  );
}
