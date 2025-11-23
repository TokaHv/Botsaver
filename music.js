import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  getVoiceConnection,
} from "@discordjs/voice";

import { getYoutubeStream } from "./youtube.js";
import ffmpegPath from "ffmpeg-static"; // <- FFmpeg static binary

// Queue
export const queue = [];
export let currentTrack = null;

// LOFI URL (can be updated via command)
export let lofiURL = process.env.LOFI_URL || "";

// Create player
export const player = createAudioPlayer({
  behaviors: { noSubscriber: NoSubscriberBehavior.Play },
});

// =============== CONNECT TO VC =================
export function connectToVC(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
  });

  connection.subscribe(player);
  console.log("🎧 Joined voice channel.");
  return connection;
}

// =============== PLAY ==========================
export async function play(url) {
  try {
    console.log("▶ Playing:", url);

    // Get YouTube stream with FFmpeg
    const stream = await getYoutubeStream(url, ffmpegPath);
    const resource = createAudioResource(stream);

    player.play(resource);
    currentTrack = url;
  } catch (err) {
    console.error("❌ Failed to play:", err);
    playNext();
  }
}

// =============== QUEUE HANDLER =================
export async function playNext() {
  if (queue.length === 0) return startLofi();
  const next = queue.shift();
  await play(next);
}

// =============== LOFI ==========================
export function startLofi() {
  if (!lofiURL) return console.error("❌ LOFI_URL missing.");
  console.log("🎼 Playing fallback LOFI:", lofiURL);
  return play(lofiURL);
}

export function setLofi(url) {
  lofiURL = url;
  console.log("🎧 LOFI URL updated:", url);
}

export function autoPlayLofi() {
  player.on(AudioPlayerStatus.Idle, () => {
    console.log("Player idle → next track or LOFI");
    playNext();
  });
}

// =============== PUBLIC FUNCTIONS ===============
export async function addToQueue(url) {
  queue.push(url);
  console.log("➕ Added to queue:", url);
  if (player.state.status !== AudioPlayerStatus.Playing) playNext();
}

export function skipSong() {
  console.log("⏭ Skipping...");
  player.stop(true);
}

export function pauseSong() {
  console.log("⏸ Paused");
  return player.pause();
}

export function resumeSong() {
  console.log("▶ Resumed");
  return player.unpause();
}

// =============== RECONNECT =====================
export function ensureConnection(guild) {
  let connection = getVoiceConnection(guild.id);
  if (!connection) {
    const channel = guild.channels.cache.get(process.env.VC_ID);
    if (channel) connectToVC(channel);
  }
}
