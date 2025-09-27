import React from "react";
import { FaGithub, FaExternalLinkAlt, FaLinkedin } from "react-icons/fa";

export default function TerminalFooter() {
  return (
    <div className="bg-gray-900 px-2 py-2 text-green-400 font-mono mt-1 border-t border-green-400 flex flex-col gap-2">
      
      {/* GitHub */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-green-300">
          Need fixes!? Why not just do it!? Or ask in the Issues section
        </div>
        <a
          href="https://github.com/Piyuzh77"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-blue-400 text-sm"
        >
          <FaGithub /> GitHub
        </a>
      </div>

      {/* Other Project */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-green-300">
          Want to prepare for the next coding interview? Check out my other project!
        </div>
        <a
          href="https://prepextra.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-blue-400 text-sm"
        >
          <FaExternalLinkAlt /> Prepextra
        </a>
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-green-300">
          Want to connect? Let's be professional buddies on LinkedIn!
        </div>
        <a
          href="https://www.linkedin.com/in/piyushg0707/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-blue-400 text-sm"
        >
          <FaLinkedin /> LinkedIn
        </a>
      </div>

    </div>
  );
}
