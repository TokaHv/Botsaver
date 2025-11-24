// youtube.linux.js
import { spawn } from "child_process";

// System commands (Linux)
const FFMPEG_PATH = "ffmpeg";
const YTDLP_PATH = "yt-dlp";

export function getYoutubeStream(url) {
  if (!url) throw new Error("You must provide a YouTube URL");

  console.log("📥 Fetching YouTube stream (Linux):", url);

  const ytdlp = spawn(YTDLP_PATH, ["-f", "bestaudio", "-o", "-", url], {
    stdio: ["ignore", "pipe", "pipe"]
  });

  const ffmpeg = spawn(FFMPEG_PATH, [
    "-hide_banner",
    "-loglevel", "error",
    "-i", "pipe:0",
    "-f", "s16le",
    "-ar", "48000",
    "-ac", "2",
    "pipe:1"
  ], { stdio: ["pipe", "pipe", "pipe"] });

  // Prevent crash on skip
  ffmpeg.stdin.on("error", err => {
    if (err.code !== "EPIPE") console.error("❗ffmpeg stdin error:", err);
  });

  // Connect processes
  ytdlp.stdout.pipe(ffmpeg.stdin);

  // Logging
  ytdlp.stderr.on("data", data => console.error("yt-dlp:", data.toString()));
  ffmpeg.stderr.on("data", data => console.error("ffmpeg:", data.toString()));

  // Cleanup
  ffmpeg.on("close", () => ytdlp.kill("SIGKILL"));

  return ffmpeg.stdout;
}
