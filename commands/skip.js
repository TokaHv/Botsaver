import { SlashCommandBuilder } from "discord.js";
import { skipSong, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song"),

  async execute(interaction) {
    if (player.state.status !== "playing") {
      return interaction.reply({ content: "❌ Nothing is playing right now.", ephemeral: true });
    }

    try {
      skipSong();
      await interaction.reply("⏭ Skipped the current song.");
    } catch (err) {
      console.error("Failed to skip song:", err);
      await interaction.reply({ content: "❌ Could not skip the song.", ephemeral: true });
    }
  },
};
// Skip command placeholder
