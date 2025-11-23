// YouTube audio helper
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

/**
 * Get a readable stream from a YouTube URL
 * @param {string} url - The YouTube link to stream
 * @param {string} ffmpegLocation - path to FFmpeg binary
 * @returns {ReadableStream} - Audio stream for Discord
 */
export function getYoutubeStream(url, ffmpegLocation = ffmpegPath) {
  if (!url) throw new Error("You must provide a YouTube URL");

  // Spawn yt-dlp process to get audio
  const process = spawn("yt-dlp", [
    "-f", "bestaudio",
    "-o", "-", // output to stdout
    url
  ], { stdio: ["ignore", "pipe", "ignore"] });

  // Pipe through FFmpeg to decode audio
  const ffmpegProcess = spawn(ffmpegLocation, [
    "-i", "pipe:0",
    "-f", "wav", // or pcm_s16le if you want raw PCM
    "pipe:1"
  ], { stdio: ["pipe", "pipe", "ignore"] });

  process.stdout.pipe(ffmpegProcess.stdin);

  return ffmpegProcess.stdout;
}
