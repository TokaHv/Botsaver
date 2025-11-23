import { SlashCommandBuilder } from "discord.js";
import { addToQueue, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a YouTube link or adds it to the queue")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("YouTube URL to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString("url");

    // Simple validation
    if (!url.startsWith("http")) {
      return interaction.reply({ content: "❌ Please provide a valid URL.", ephemeral: true });
    }

    try {
      addToQueue(url);
      const msg = player.state.status !== "playing" ? "▶ Now playing:" : "➕ Added to queue:";
      await interaction.reply(`${msg} ${url}`);
    } catch (err) {
      console.error("Failed to add to queue:", err);
      await interaction.reply({ content: "❌ Could not play the link.", ephemeral: true });
    }
  },
};
