import { SlashCommandBuilder } from "discord.js";
import { queue, currentTrack } from "../music.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current music queue"),

  async execute(interaction) {
    try {
      if (!currentTrack && queue.length === 0) {
        return interaction.reply({ content: "❌ The queue is empty.", ephemeral: true });
      }

      let message = "";
      if (currentTrack) {
        message += `🎶 **Now playing:** ${currentTrack}\n`;
      }

      if (queue.length > 0) {
        message += `📃 **Up next:**\n`;
        queue.forEach((track, index) => {
          message += `${index + 1}. ${track}\n`;
        });
      }

      await interaction.reply(message);
    } catch (err) {
      console.error("Failed to show queue:", err);
      await interaction.reply({ content: "❌ Could not retrieve the queue.", ephemeral: true });
    }
  },
};
// Queue command placeholder
