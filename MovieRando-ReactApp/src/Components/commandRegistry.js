import { fetchRandomDynamic, searchMediaDynamic } from "./mediaHandlers";

export const commandRegistry = {
  "clear": async () => "",
  "mr -random": fetchRandomDynamic,
  "mr -search": searchMediaDynamic,
};
