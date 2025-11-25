import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  getVoiceConnection,
  StreamType,
} from "@discordjs/voice";

import { getYoutubeStream } from "./youtube.linux.js";

export const queue = [];
export let currentTrack = null;
export let isPlayingLofi = false;

// LOFI fallback
export let lofiURL =
  process.env.LOFI_URL || "https://www.youtube.com/watch?v=aiVGgt8fztA";

export const player = createAudioPlayer({
  behaviors: { noSubscriber: NoSubscriberBehavior.Play },
});

// CONNECT TO VC
export function connectToVC(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  connection.subscribe(player);
  console.log("🎧 Joined voice channel.");
  return connection;
}

// PLAY
export function play(url, lofi = false) {
  console.log("▶ Playing:", url);

  try {
    const stream = getYoutubeStream(url);

    const resource = createAudioResource(stream, {
      inputType: StreamType.Raw,
      inlineVolume: false,
    });

    player.play(resource);

    isPlayingLofi = lofi;
    currentTrack = lofi ? null : url;
  } catch (err) {
    console.error("❌ Failed to play:", err.message);
    playNext();
  }
}

// PLAY NEXT
export function playNext() {
  if (queue.length > 0) {
    const next = queue.shift();
    play(next, false);
    return;
  }

  console.log("🎼 Queue empty → playing LOFI fallback:", lofiURL);
  play(lofiURL, true);
}

// ADD TO QUEUE
export function addToQueue(url) {
  queue.push(url);
  console.log("➕ Added to queue:", url);

  if (player.state.status !== AudioPlayerStatus.Playing || isPlayingLofi) {
    playNext();
  }
}

// SKIP (FIXED)
export function skipSong() {
  if (!currentTrack && queue.length === 0) {
    console.log("❌ Nothing to skip.");
    return;
  }

  console.log("⏭ Skipping...");

  try {
    player.stop(true); // triggers Idle → playNext()
  } catch (err) {
    console.error("❌ Skip error:", err);
    playNext();
  }
}

export function pauseSong() {
  console.log("⏸ Paused");
  player.pause();
}

export function resumeSong() {
  console.log("▶ Resumed");
  player.unpause();
}

export function clearQueue() {
  queue.length = 0;
  console.log("🗑 Queue cleared");
}

export function setLofi(url) {
  lofiURL = url;
  console.log("🎧 LOFI updated:", url);
}

export function ensureConnection(guild) {
  let connection = getVoiceConnection(guild.id);
  if (!connection) {
    const channel = guild.channels.cache.get(process.env.VC_ID);
    if (channel) connectToVC(channel);
  }
}

// AUTOPLAY
player.on(AudioPlayerStatus.Idle, () => {
  playNext();
});

player.on("error", (err) => {
  console.error("❌ Player error:", err.message);
  playNext();
});
