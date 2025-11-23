import { SlashCommandBuilder } from "discord.js";
import { pauseSong, player } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song"),

  async execute(interaction) {
    if (player.state.status !== "playing") {
      return interaction.reply({ content: "❌ Nothing is playing right now.", ephemeral: true });
    }

    try {
      pauseSong();
      await interaction.reply("⏸ Paused the current song.");
    } catch (err) {
      console.error("Failed to pause song:", err);
      await interaction.reply({ content: "❌ Could not pause the song.", ephemeral: true });
    }
  },
};
