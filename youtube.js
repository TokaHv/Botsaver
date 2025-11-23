// YouTube audio helper placeholder
import { spawn } from "child_process";

/**
 * Get a readable stream from a YouTube URL
 * @param {string} url - The YouTube link to stream
 * @returns {ReadableStream} - Audio stream for Discord
 */
export function getYoutubeStream(url) {
  if (!url) throw new Error("You must provide a YouTube URL");

  // Spawn yt-dlp process
  const process = spawn("yt-dlp", [
    "-f", "bestaudio",
    "-o", "-", // output to stdout
    url
  ], { stdio: ["ignore", "pipe", "ignore"] });

  return process.stdout;
}
