import React from "react";
import TerminalFooter from "./TerminalFooter";

export default function TerminalInput({ prompt, input, setInput, handleKeys }) {
  return (
    <div className="flex flex-col w-full">
      {/* Input line */}
      <div className="flex items-center bg-gray-900 border-t border-green-400 px-2 py-1 w-full">
        <span className="mr-2">{prompt}$</span>
        <input
          type="text"
          className="bg-gray-900 outline-none text-green-400 flex-1 min-w-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeys}
          autoFocus
        />
      </div>

      {/* Footer with links */}
      <TerminalFooter />
    </div>
  );
}
