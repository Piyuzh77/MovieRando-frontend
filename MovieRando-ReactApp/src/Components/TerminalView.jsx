import React, { useEffect, useState } from "react";

const spinnerFrames = ["|", "/", "-", "\\"];

const TerminalView = ({
historyRef,
history,
prompt,
setPosters,
changePage,
loading,
}) => {
const [spinnerIndex, setSpinnerIndex] = useState(0);

// animate spinner every 150ms
useEffect(() => {
if (!loading) return;
const interval = setInterval(() => {
setSpinnerIndex((prev) => (prev + 1) % spinnerFrames.length);
}, 150);
return () => clearInterval(interval);
}, [loading]);

return (
<div
ref={historyRef}
className="p-4 overflow-y-scroll"
style={{ height: "70vh" }}
>
{history.map((item, idx) => ( <div key={idx} className="mb-2"> <div className="flex"> <span className="mr-2">{prompt}$</span> <span>{item.command}</span> </div>
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

  {/* Loading animation */}
  {loading && (
    <div className="ml-4 text-green-400 font-mono">
      {spinnerFrames[spinnerIndex]} Loading...
    </div>
  )}
</div>  

);
};

export default TerminalView;
